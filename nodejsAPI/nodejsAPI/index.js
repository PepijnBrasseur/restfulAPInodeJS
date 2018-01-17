const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://brasseurpepijn.eu.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://brasseurpepijn.eu.auth0.com/`,
    algorithms: ['RS256']
});

app.get('/', function (req, res, next) {
    res.status(404).send({ message: "Not Found" });
});

app.get('/api', function (req, res, next) {
    res.status(404).send({ message: "Not Found" });
});

app.get('/api/public', function (req, res) {
    res.status(201).send({ message: "Public endpoint" });
})

app.post('/api/public', function (req, res) {
    res.sendStatus(405);
});

app.get('/api/private', checkJwt, function (req, res) {
    res.status(201).send({ message: "Private endpoint" });
})

app.post('/api/private', checkJwt, function (req, res) {
    res.sendStatus(405);
})

app.listen(8080);
