// SWAGGER OPTIONS - CONFIGURATION OF THE AUTO-GENERATED API DOCUMENTATION

// DOC: https://brikev.github.io/express-jsdoc-swagger-docs/

const swaggerOption = {

  openapi: '3.0.1',

  // GLOBAL INFORMATION ABOUT THE API

  info: {
    version: '1.0.0',
    title: 'RSS Reader Web API',
    description: 'RSS/Atom feeds aggregator API',
    license: {
      name: 'ISC', //! TO CHECK
    },
  },

  // SECURITY SCHEME DECLARED FOR THE INTERACTIVE DOC (AUTHORIZE BUTTON)
  // MATCHES THE JWT SENT BY THE FRONT AS "Authorization: Bearer <token>"

  security: {
    "BearerAuth": {
      "type": "http",
      "scheme": "bearer"
    }
  },

  // ROOT DIRECTORY OF THE API (FILES ARE SCANNED FROM HERE)

  baseDir: __dirname,

  // DIRECTORIES SCANNED TO GENERATE THE SWAGGER
  // "**" DESCENDS INTO SUBDIRECTORIES (controllers/auth/, controllers/account/...)

  filesPattern: [
    './controllers/**/*.js',
  ],

  // SWAGGER UI - DOCS PAGE AVAILABLE AT http://localhost:PORT/doc

  exposeSwaggerUI: true,
  swaggerUIPath: '/doc',
  swaggerUiOptions: {},

  // RAW JSON API DOCS - SERVED AT /v3/api-docs/swagger.json

  exposeApiDocs: true,
  apiDocsPath: '/v3/api-docs/swagger.json',
};

module.exports = swaggerOption;


