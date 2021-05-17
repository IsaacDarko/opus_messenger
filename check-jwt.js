const jwt = require('express-jwt')
const jwks = require('jwks-rsa');
const {domain, audience} = require('./authVariables.json');
require('dotenv').config();

//set up jwt for tokens
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev--fe2sg9v.us.auth0.com/.well-known/jwks.json',
    }),


    audience: 'https://ready-for-action',
    issuer: 'https://dev--fe2sg9v.us.auth0.com/',
    algorithms: ['RS256']
})

module.exports = {
    jwtCheck,
};