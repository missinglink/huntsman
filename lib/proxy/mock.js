
var examples = {
  'http://www.example.com': {
    err: null,
    res: {
      uri: 'http://www.example.com',
      statusCode: 200,
      headers: [ 'Content-Type: text/html' ]
    },
    body: '<html><body>Hello World!</body></html>'
  }
};

module.exports = function( fixtures ){
  if( !fixtures ) fixtures = examples;
  return function( uri, cb ){
    if( uri in fixtures ) return cb( fixtures[ uri ].err, fixtures[ uri ].res, fixtures[ uri ].body );
    return cb( 'fixture not found', {
      uri: uri,
      statusCode: 404,
      headers: []
    }, null );
  };
};