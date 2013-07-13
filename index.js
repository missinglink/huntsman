
module.exports = {
  spider: require( './lib/huntsman' ),
  extension: function(){
    var args = Array.prototype.slice.call( arguments, 0 );
    var extension = require( './lib/extension/' + args.shift() );
    return extension.apply( extension, args );
  }
};