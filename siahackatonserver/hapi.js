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
        var countryIata = request.query.country || 'KUL';
        var outbound= request.query.outbound || '2015-12-12'; //yyyy-mm-dd
        var inbound= request.query.inbound || '2015-12-22'; //yyyy-mm-dd
        console.log(countryIata);
        console.log(outbound);
        console.log(inbound);
        if(countryIata !== '' && outbound !== '' && inbound !== ''){
          console.log('hey im inside the if statement');
          npmrequest.post('http://api.skyscanner.net/apiservices/pricing/v1.0/',
            {form:{
                apiKey : 'ah777687064604833763210903061553',
                country : 'SG',
                currency : 'SGD',
                locale : 'en-SG',
                locationschema : 'iata',
                originplace : 'SIN',
                destinationplace : countryIata,
                outbounddate : outbound,
                inbounddate : inbound,
                adults : '1',
                grouppricing : 'on',
                cabinclass : 'Economy'
              }
            }).on('response', function(response) {
              console.log(response);
              if(response.statusCode > 199 && response.statusCode < 300){
                var location = response.caseless.dict.location;
                npmrequest.get(location + '?apiKey=ah777687064604833763210903061553',
                function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    console.log('YIPEE SAYS YUPPIE');
                    return reply(body) // Show the HTML for the Google homepage.
                  }
                })
              }
              
            })
        }
      }
    }
  }
);
