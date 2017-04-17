const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const annyang = require('annyang');

const server = new Hapi.Server(~~process.env.PORT || 3000, '0.0.0.0');
const defaultContext = {
  title: 'Testy Title'
};

// server.connection({
//   port: +process.env.PORT || 3000,
//   host: process.env.HOSTNAME
// });

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
  handler: function (request, reply) {
    console.log('**request**');
    reply('Reply !');
    if (annyang) {
      // Let's define our first command. First the text we expect, and then the function it should call
      var commands = {
        'hide': function() {
          console.log('hide');
          // $('#talk_pool').val = 'hide';
        },
        'show': function() {
          console.log('show');
          // $('#talk_pool').value = 'show';
        },
        'delete': function() {
          console.log('delete');
          // $('#talk_pool').val('delete');
        },
        'add': function() {
          console.log('add');
          // $('#talk_pool').innerHTML = 'add';
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      annyang.addCallback('soundstart', function() {
        console.log('sound detected');
      });

      annyang.addCallback('result', function() {
        console.log('sound stopped');
      });

      annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
        console.log(userSaid); // sample output: 'hello'
        console.log(commandText); // sample output: 'hello (there)'
        console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
        // $('#talk_pool').val = userSaid;
        // $('#talk_pool').value = userSaid;
        $('#talk_pool').val($('#talk_pool').val() + ' ' + userSaid);

      });

      // annyang.trigger('Hide');

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
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

server.start(function (err) {
  if (err) {
    console.log('Error !');
    console.log(err);
  }

  console.log('server started at ', server.info.uri);

});
