const newman = require('newman');
const async = require('async');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { calculateMetrics } = require('./utils/metrics');

const environments = ['local', 'dev', 'staging', 'prod'];
const currentEnv = process.env.TEST_ENV || 'local';
const PARALLEL_RUNS = 3;

const generateHTMLReport = (results) => {
    const template = fs.readFileSync(
        path.join(__dirname, 'templates/report.html'),
        'utf8'
    );
    const compiledTemplate = Handlebars.compile(template);
    
    const reportData = {
        title: `CareerCanvas Auth API Tests - ${currentEnv}`,
        environment: currentEnv,
        timestamp: new Date().toISOString(),
        summary: {
            total: results.length,
            passed: results.filter(r => !r.error).length,
            failed: results.filter(r => r.error).length
        },
        tests: results.map(r => ({
            name: r.collection.name,
            passed: !r.error,
            duration: r.duration,
            error: r.error?.message
        }))
    };

    const html = compiledTemplate(reportData);
    const reportPath = path.join(
        __dirname,
        '../test-results',
        `report-${currentEnv}-${new Date().toISOString()}.html`
    );
    
    fs.writeFileSync(reportPath, html);
};

const runCollection = (callback) => {
    const startTime = Date.now();
    const executions = [];

    newman.run({
        collection: require('../CareerCanvas-Auth.postman_collection.json'),
        environment: require(`../environments/${currentEnv}.postman_environment.json`),
        reporters: ['cli', 'htmlextra', 'json'],
        reporter: {
            htmlextra: {
                export: `./test-results/${currentEnv}-${new Date().toISOString()}.html`,
                title: `CareerCanvas Auth API Tests - ${currentEnv}`,
                darkTheme: true,
                showEnvironmentData: true
            }
        },
        iterationCount: 1,
        timeoutRequest: 5000,
        delayRequest: 100,
        reporters: ['cli'],
        reporter: {
            cli: {
                noSummary: true,
                silent: process.env.CI === 'true'
            }
        }
    }, (err, summary) => {
        const duration = Date.now() - startTime;
        callback(err, { 
            ...summary, 
            duration,
            executions: summary.run.executions
        });
    });
};

const generateReport = (results) => {
    const metrics = calculateMetrics(results);
    const report = {
        timestamp: new Date().toISOString(),
        environment: currentEnv,
        summary: {
            total: results.length,
            passed: results.filter(r => !r.error).length,
            failed: results.filter(r => r.error).length
        },
        performance: metrics,
        details: results.map(r => ({
            name: r.collection.name,
            duration: r.duration,
            error: r.error?.message,
            endpoints: r.executions?.map(e => ({
                name: e.item.name,
                responseTime: e.response?.responseTime,
                status: e.response?.code
            }))
        }))
    };

    const reportPath = path.join(__dirname, '../test-results', 
        `report-${currentEnv}-${new Date().toISOString()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    generateHTMLReport(report);
};

console.log(`Starting test run in ${currentEnv} environment`);

async.times(
    PARALLEL_RUNS,
    (n, next) => {
        console.log(`Starting parallel run #${n + 1}`);
        runCollection(next);
    },
    (err, results) => {
        if (err) {
            console.error('Test run failed:', err);
            process.exit(1);
        }
        generateReport(results);
        console.log('All test runs completed successfully');
    }
);