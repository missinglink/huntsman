
function EventEmitter(){
  this._events = [];
  this.maxListeners = 10;
}

EventEmitter.prototype.on = function( regex, cb ){
  if( this._events.length >= this.maxListeners ) return this.emit( 'error', 'max event listeners' );
  this._events.push({
    regex: regex,
    cb: cb
  });
};

EventEmitter.prototype.once = function( regex, cb ){
  if( this._events.length >= this.maxListeners ) return this.emit( 'error', 'max event listeners' );
  this._events.push({
    regex: regex,
    cb: cb,
    once: true
  });
};

EventEmitter.prototype.removeListener = function( regex ){
  this._events = this._events.filter( function( event ){
    return( String( event.regex ) !== String( regex ) );
  });
};

EventEmitter.prototype.removeAllListeners = function( regex ){
  this._events = this._events.filter( function( event ){
    if( !regex ) return false;
    if( String( event.regex ) === String( regex ) ) return false;
    else return true;
  });
};

EventEmitter.prototype.setMaxListeners = function( n ){
  this.maxListeners = n;
};

EventEmitter.prototype.listeners = function( regex ){
  return this._events.filter( function( event ){
    return( !regex || String( event.regex ) === String( regex ) );
  });
};

EventEmitter.prototype.match = function( string ){
  for( var i in this._events ){
    if( string.match( this._events[i].regex ) ){
      return true;
    }
  }
  return false;
};

EventEmitter.listeners = function( emitter, regex ){
  if( !regex ) return emitter._events.length;
  return emitter._events.filter( function( event ){
    return( String( event.regex ) === String( regex ) );
  }).length;
};

EventEmitter.prototype.emit = function(){
  var args = Array.prototype.slice.call( arguments, 0 );
  var key = args.shift();
  var _self = this;
  this._events.forEach( function( event ){
    if( key.match( event.regex ) ){
      if( 'function' === typeof event.cb ) event.cb.apply( null, args );
      else if( event.once ) _self.removeListener( event.regex );
    }
  });
};

module.exports = EventEmitter;