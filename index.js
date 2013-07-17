
function loadModule( mod ){
  return function(){
    var args = Array.prototype.slice.call( arguments, 0 );
    var module = require( './lib/' + mod + '/' + args.shift() );
    return module.apply( module, args );
  };
}

module.exports = {
  spider: require( './lib/huntsman' ),
  proxy: loadModule( 'proxy' ),
  extension: loadModule( 'extension' ),
  storage: loadModule( 'storage' )
};