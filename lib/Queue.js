
function Queue( isUnique ){
  this.data = [];
  this.complete = [];
  this.isUnique = ( 'boolean' === typeof isUnique ) ? isUnique : true;
}

Queue.prototype.has = function( key ){
  return( 0 <= this.data.indexOf( key ) );
};

Queue.prototype.count = function(){
  return this.data.length;
};

Queue.prototype.add = function( key ){
  if( !this.isUnique || ( -1 === this.complete.indexOf( key ) && !this.has( key ) ) ){
    this.data.push( key );
    return true;
  }
  return false;
};

Queue.prototype.remove = function( key ){
  if( this.isUnique ){
    this.data = this.data.filter( function( elem ){
      return( elem !== key );
    });
  }
  else {
    var i = this.data.indexOf( key );
    if( i > -1 ){
      this.data.splice( i, 1 );
    }
  }
};

Queue.prototype.shift = function(){
  val = this.data.shift();
  if( val ) this.complete.push( val );
  return val;
};

Queue.prototype.pop = function(){
  val = this.data.pop();
  if( val ) this.complete.push( val );
  return val;
};

module.exports = Queue;