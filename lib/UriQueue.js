
function UriQueue( isUnique ){
  this.data = [];
  this.isUnique = isUnique || true;
}

UriQueue.prototype.has = function( key ){
  return( 0 <= this.data.indexOf( key ) );
};

UriQueue.prototype.add = function( key ){
  if( !this.isUnique || !this.has( key ) ){
    this.data.push( key );
    return true;
  }
  return false;
};

UriQueue.prototype.remove = function( key ){
  this.data = this.data.filter( function( elem ){
    return( elem !== key );
  });
};

UriQueue.prototype.shift = function(){
  return this.data.shift();
};

UriQueue.prototype.pop = function(){
  return this.data.pop();
};

module.exports = UriQueue;