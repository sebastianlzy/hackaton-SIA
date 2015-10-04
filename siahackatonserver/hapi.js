var Hapi = require('hapi');

var server = new Hapi.Server();
var npmrequest = require('request');

server.connection({ port: 3000 });

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route(
  {
    method: 'GET',
    path: '/',
    config: {
      cors : true,
      handler: function(request, reply){

        npmrequest.post('http://api.skyscanner.net/apiservices/pricing/v1.0/',
          {form:{
              apiKey : 'ah322701755212619960577281750738',
              country : 'SG',
              currency : 'SGD',
              locale : 'en-SG',
              locationschema : 'iata',
              originplace : 'SIN',
              destinationplace : 'KUL',
              outbounddate : '2015-10-10',
              inbounddate : '2015-10-17',
              adults : '1',
              grouppricing : 'on',
              cabinclass : 'Economy'
            }
          }).on('response', function(response) {
            if(response.statusCode > 199 && response.statusCode < 300){
                  var location = response.caseless.dict.location;
                  npmrequest.get(location + '?apiKey=ah322701755212619960577281750738',
                  function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      return reply(body) // Show the HTML for the Google homepage.
                    }
                  })
            }
          })

      }
    }
  }
);
