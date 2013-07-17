
var fs = require('fs');
var path = require('path');
var cache = require('./memory');
var store = cache();

module.exports = function( filename, options, errorback ){

  if( 'string' !== typeof filename ) throw new Error( 'invalid file name' );
  if( 'object' !== typeof options || !options ) options = {};
  if( 'function' !== typeof errorback ) errorback = console.error;

  var filestore = {
    synced: false,
    get: function( key ){
      return store.get( key );
    },
    set: function( key, value ){
      filestore.synced = false;
      store.set( key, value );
    },
    del: function( key ){
      filestore.synced = false;
      store.del( key );
    },
    read: function(){

      var path = null;
      try { path = path.resolve( filename ); }
      catch( e ){ return errorback( e ); }

      if( path )
      fs.stat( path, function( err, stats ){
        if( err ) return errorback( err );
        fs.readFile( path, function( err, data ){
          if( err ) return errorback( err );
          store = cache( JSON.parse( data ) );
          filestore.synced = true;
        });
      });
    },
    write: function(){
      if( !filestore.synced ){
        fs.writeFile( path.resolve( filename ), JSON.stringify( filestore.data ), function( err ){
          if( err ) throw new Error( err );
          filestore.synced = true;
        });
      }
    }
  };

  if( options.writeInterval ){
    setInterval( filestore.write, options.writeInterval );
  }

  filestore.read();
  return filestore;
};