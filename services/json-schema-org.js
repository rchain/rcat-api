const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true
});
const schema = require('../meta/acquisition-request-schema');
const validateAcqusitionPostSchema = ajv.compile(schema);

module.exports = {
    validateAcqusitionPostSchema
};