const calculateMetrics = (results) => {
    const responseTimes = results.flatMap(r => 
        r.executions?.map(e => e.response?.responseTime) || []
    ).filter(Boolean);

    return {
        avgResponseTime: Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        ),
        maxResponseTime: Math.max(...responseTimes),
        minResponseTime: Math.min(...responseTimes),
        p95ResponseTime: calculatePercentile(responseTimes, 95),
        totalRequests: responseTimes.length,
        successRate: (
            results.filter(r => !r.error).length / results.length * 100
        ).toFixed(2)
    };
};

const calculatePercentile = (array, percentile) => {
    const sorted = array.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * (percentile / 100)) - 1;
    return sorted[index];
};