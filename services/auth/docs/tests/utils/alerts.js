const nodemailer = require('nodemailer');
const slack = require('@slack/webhook');
const AWS = require('aws-sdk');

class AlertManager {
    constructor(config) {
        this.config = config;
        this.alerts = [];
        this.cloudwatch = new AWS.CloudWatch();
        
        if (process.env.SLACK_WEBHOOK_URL) {
            this.slackWebhook = new slack.IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
        }

        if (process.env.EMAIL_ALERTS === 'true') {
            this.mailer = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }
    }

    checkThresholds(metrics, thresholds) {
        Object.entries(metrics.endpoints).forEach(([endpoint, data]) => {
            const threshold = thresholds.endpoints[endpoint];
            if (!threshold) return;

            if (data.responseTime > threshold.maxResponseTime) {
                this.addAlert('warning', `High response time for ${endpoint}: ${data.responseTime}ms`);
            }

            if (data.successRate < threshold.successRate) {
                this.addAlert('critical', `Low success rate for ${endpoint}: ${data.successRate}%`);
            }
        });

        if (metrics.performance.avgResponseTime > thresholds.global.avgResponseTime) {
            this.addAlert('warning', `High average response time: ${metrics.performance.avgResponseTime}ms`);
        }
    }

    async sendAlerts() {
        if (this.alerts.length === 0) return;

        await Promise.all([
            this.sendSlackAlert(),
            this.sendEmailAlert(),
            this.publishMetrics()
        ]);
    }

    private async sendEmailAlert() {
        if (!this.mailer) return;

        const html = this.alerts.map(alert => `
            <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid ${alert.severity === 'critical' ? '#dc3545' : '#ffc107'}">
                <strong>${alert.severity.toUpperCase()}</strong>: ${alert.message}
                <br>
                <small>${alert.timestamp}</small>
            </div>
        `).join('');

        await this.mailer.sendMail({
            from: process.env.ALERT_EMAIL_FROM,
            to: process.env.ALERT_EMAIL_TO,
            subject: `🚨 Performance Alert - CareerCanvas Auth API (${process.env.TEST_ENV})`,
            html: `
                <h2>Performance Alerts</h2>
                <p>Environment: ${process.env.TEST_ENV}</p>
                <p>Time: ${new Date().toISOString()}</p>
                ${html}
            `
        });
    }

    private async publishMetrics() {
        const metrics = this.alerts.map(alert => ({
            MetricName: 'PerformanceAlert',
            Value: alert.severity === 'critical' ? 2 : 1,
            Unit: 'Count',
            Dimensions: [
                {
                    Name: 'Environment',
                    Value: process.env.TEST_ENV
                },
                {
                    Name: 'Severity',
                    Value: alert.severity
                }
            ],
            Timestamp: new Date(alert.timestamp)
        }));

        await this.cloudwatch.putMetricData({
            Namespace: 'CareerCanvas/AuthAPI/Performance',
            MetricData: metrics
        }).promise();
    }

    getAlertSummary() {
        return {
            total: this.alerts.length,
            critical: this.alerts.filter(a => a.severity === 'critical').length,
            warning: this.alerts.filter(a => a.severity === 'warning').length,
            alerts: this.alerts
        };
    }
}

module.exports = AlertManager;