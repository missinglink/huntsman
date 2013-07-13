
function Queue( isUnique ){
  this.data = [];
  this.isUnique = isUnique || true;
}

Queue.prototype.has = function( key ){
  return( 0 <= this.data.indexOf( key ) );
};

Queue.prototype.add = function( key ){
  if( !this.isUnique || !this.has( key ) ){
    this.data.push( key );
    return true;
  }
  return false;
};

Queue.prototype.remove = function( key ){
  this.data = this.data.filter( function( elem ){
    return( elem !== key );
  });
};

Queue.prototype.shift = function(){
  return this.data.shift();
};

Queue.prototype.pop = function(){
  return this.data.pop();
};

module.exports = Queue;