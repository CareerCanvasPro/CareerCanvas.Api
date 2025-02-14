const registerTests = {
    name: 'Register Endpoint Tests',
    tests: [
        {
            name: 'Successful Registration',
            request: {
                email: `test${Date.now()}@example.com`,
                password: 'ValidPass123!',
                name: 'Test User'
            },
            expect: {
                status: 201,
                hasToken: true,
                hasUser: true
            }
        },
        {
            name: 'Invalid Email',
            request: {
                email: 'invalid-email',
                password: 'ValidPass123!',
                name: 'Test User'
            },
            expect: {
                status: 400,
                error: 'ValidationError'
            }
        }
    ]
};