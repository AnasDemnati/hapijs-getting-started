var Hapi = require('hapi');
var Joi = require('joi');
const Path = require('path');
const Hoek = require('hoek');

const defaultContext = {
  title: 'Testy Title'
};

var internals = {};


// Type shortcuts

var S = Joi.string;
var N = Joi.number;
var A = Joi.array;



internals.get = function (request, reply) {

    reply('Success!\n');
};


internals.output = function (request, reply) {

    reply({ myOutput: request.query.input });
};


internals.payload = function (request, reply) {

    reply('Success!\n');
};


internals.echo = function (request, reply) {

    reply(request.payload);
};

internals.redirect = function (request, reply) {

    reply.redirect('/error');
};

internals.error = function (request, reply) {

    reply('This is my error');
};

var server = new Hapi.Server(~~process.env.PORT || 3000, '0.0.0.0');

server.route([
    { method: 'GET', path: '/', config: { handler: internals.get, validate: { query: { username: S() } } } },
    { method: 'POST', path: '/', config: { handler: internals.echo, payload: { parse: true } } },
    { method: 'GET', path: '/admin', config: { handler: internals.get, validate: { query: { username: S().required(), password: S().required() } } } },
    { method: 'GET', path: '/users', config: { handler: internals.get, validate: { query: { email: S().email().required().min(18) } } } },
    { method: 'GET', path: '/config', config: { handler: internals.get, validate: { query: { choices: A().required() } } } },
    { method: 'GET', path: '/test', config: { handler: internals.get, validate: { query: { num: N().min(0) } } } },
    { method: 'GET', path: '/output', config: { handler: internals.output, validate: { query: { input: S().min(3) } } } },
    { method: 'GET', path: '/users/{id}', config: { description: 'Get a user', handler: internals.get, validate: { params: { id: N().required() }, query: { name: S().description('the user name').required() } } } },
    { method: 'GET', path: '/redirect', config: { handler: internals.redirect } },
    { method: 'GET', path: '/error', config: { handler: internals.error } }
]);

var schema = Joi.object().keys({
    title: S().required().invalid('director'),
    status: S().required().valid('open', 'pending', 'close'),
    participants: A().required().includes(S(), N()).min(2)
});

server.route({
    method: 'POST',
    path: '/users/{id}',
    config: {
        handler: internals.payload,
        validate: {
            payload: schema
        }
    }
});

server.route({
  method: 'GET',
  path: '/testy/{user?}',
  handler: function (request, reply) {
    const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';

    reply(user);
  },
  config: {
    description: 'Description',
    notes: 'Notes',
    tags: ['api', 'greeting']
  }
});

server.route({
    method: 'GET',
    path: '/index',
    handler: {
        file: 'public/index.html'
    }
});

server.route({
    method: 'GET',
    path: '/speechy',
    handler: {
        file: 'public/speechy.html'
    }
});

server.route({
    method: 'GET',
    path: '/quotes',
    handler: {
        file: 'proverbes.json'
    }
});

// server.register(require('inert'), (err) => {
//
//     if (err) {
//         throw err;
//     }
//
//     server.route({
//         method: 'GET',
//         path: '/quotes',
//         handler: function (request, reply) {
//             reply.file('proverbes.json');
//         }
//     });

// server.register(require('vision'), function (err) {
//
//     if (err) {
//         throw err;
//     }
//
//     server.views({
//       engines: {
//         html: require('handlebars')
//       },
//       context: defaultContext,
//       relativeTo: __dirname,
//       path: './templates',
//       layoutPath: './templates/layout',
//       helpersPath: './templates/helpers'
//     });
// });

server.start(function () {

    console.log('Server started at [' + server.info.uri + ']');
});
