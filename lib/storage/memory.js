
module.exports = function( init ){

  var memorystore = {
    store: ( 'object' === typeof init ) ? init : {},
    get: function( key ){
      return memorystore.store[ key ];
    },
    set: function( key, value ){
      memorystore.store[ key ] = value;
    },
    del: function( key ){
      delete memorystore.store[ key ];
    }
  };

  return memorystore;
};