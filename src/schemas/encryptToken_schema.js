const encryptTokenSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                token: {
                    type: 'object',
                    properties: {
                        payload: {
                            type: 'object'
                        }
                    },
                    required: ['payload']
                }
            },
            required: ['token']
        }
    },
    required: ['data']
};

module.exports = encryptTokenSchema;
