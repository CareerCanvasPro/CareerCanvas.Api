module.exports = {
    endpoints: {
        '/auth/login': {
            maxResponseTime: 1000,
            p95ResponseTime: 800,
            successRate: 99.5
        },
        '/auth/register': {
            maxResponseTime: 1500,
            p95ResponseTime: 1200,
            successRate: 99
        },
        '/auth/magic-link': {
            maxResponseTime: 2000,
            p95ResponseTime: 1500,
            successRate: 98
        },
        '/auth/otp': {
            maxResponseTime: 1000,
            p95ResponseTime: 800,
            successRate: 99
        }
    },
    global: {
        avgResponseTime: 800,
        minSuccessRate: 98,
        maxErrorRate: 2,
        concurrentUsers: 100
    }
};