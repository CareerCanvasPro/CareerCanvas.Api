const authTests = {
    name: 'Authentication Flow Tests',
    tests: [
        {
            name: 'Login Success',
            request: {
                email: 'test@example.com',
                password: 'ValidPass123!'
            },
            expect: {
                status: 200,
                hasToken: true,
                hasUser: true
            }
        },
        {
            name: 'OTP Flow',
            steps: [
                {
                    name: 'Send OTP',
                    request: {
                        phoneNumber: '+8801712345678'
                    },
                    expect: {
                        status: 200,
                        message: 'OTP sent successfully'
                    }
                },
                {
                    name: 'Verify OTP',
                    request: {
                        phoneNumber: '+8801712345678',
                        code: '123456'
                    },
                    expect: {
                        status: 200,
                        hasToken: true
                    }
                }
            ]
        }
    ]
};