
var Huntsman = require('./index');
var spider = new Huntsman();

spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/([^\/]*)/, function ( res, $, body ){

  console.log( ' -> ' + res.url );
  console.log( $('h1.firstHeading').text().trim() );
  console.log( $('div#mw-content-text p').first().text().trim() );
  console.log();

});

spider.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();