pm.test("Response structure", () => {
    const schema = {
        type: 'object',
        required: ['token', 'user'],
        properties: {
            token: { type: 'string' },
            user: {
                type: 'object',
                required: ['id', 'email', 'name'],
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    title: { type: 'string' },
                    institution: { type: 'string' },
                    location: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    };

    pm.response.to.have.jsonSchema(schema);
});

pm.test("Authentication flow", () => {
    if (pm.response.code === 200 || pm.response.code === 201) {
        const jsonData = pm.response.json();
        
        // Store token for subsequent requests
        if (jsonData.token) {
            pm.environment.set("authToken", jsonData.token);
            pm.expect(jsonData.token).to.be.a('string').and.to.match(/^eyJ/);
        }
        
        // Store user data
        if (jsonData.user) {
            pm.environment.set("userId", jsonData.user.id);
            pm.expect(jsonData.user.id).to.be.a('string').and.to.match(/^usr_/);
        }
    }
});

pm.test("Error responses", () => {
    if (pm.response.code >= 400) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('error');
        pm.expect(jsonData).to.have.property('message');
        pm.expect(jsonData.error).to.be.a('string');
        pm.expect(jsonData.message).to.be.a('string');
    }
});