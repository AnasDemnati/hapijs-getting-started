const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');

const server = new Hapi.Server();
const defaultContext = {
  title: 'Testy Title'
};

server.connection({
  port: +process.env.PORT || 3000,
  host: process.env.HOSTNAME
});

// server.register(require('vision'), (err) => {
//   Hoek.assert(!err, err);
//
//   server.views({
//     engines: {
//       html: require('handlebars')
//     },
//     context: defaultContext,
//     relativeTo: __dirname,
//     path: './templates',
//     layoutPath: './templates/layout',
//     helpersPath: './templates/helpers'
//   });
// });

server.route({
  method: 'GET',
  path: '/testy',
  handler: (request, reply) => {
    console.log('**request**');
    reply('Reply !');
  }
});

server.route({
  method: 'GET',
  path: '/testy/{user?}',
  handler: (request, reply) => {
    const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';

    reply(user);
  },
  config: {
    description: 'Description',
    notes: 'Notes',
    tags: ['api', 'greeting']
  }
});

server.start(err => {
  if (err) {
    console.log('Error !');
    console.log(err);
  }

  console.log('server started at ', server.info.uri);

});
