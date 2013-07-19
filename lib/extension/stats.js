
var stats = { errors: 0, success: 0, codes: {} };
var lastResponse = new Date().getTime();
var rps = { prev: 0, now: 0 };
var log = { prev: '', now: '' };
var bytes = { prev: 0, now: 0, total: 0 };

var pollInterval = setInterval( function(){
  bytes.prev = bytes.now;
  rps.prev = rps.now;
  bytes.now = rps.now = 0;

  // Clear interval after 10 seconds of inactivity
  if( ( new Date().getTime() - 10000 ) > ( lastResponse ) ){
    clearInterval( pollInterval );
  }
}, 1000 );

var emit = function( emitter, res, options ){

  log.prev = log.now;
  log.now = '';
  if( emitter.queue ) log.now += ' \x1b[1;34mQueued\x1b[0;34m:' + emitter.queue.data.length + '\x1b[0m';
  log.now += ' \x1b[1;32m✓\x1b[0;32m ' + stats.success + '\x1b[0m';
  log.now += ' \x1b[1;31m✘\x1b[1;31m ' + stats.errors + '\x1b[0m';

  rps.now++;
  if( rps.prev ) log.now += ' \x1b[1;33m⌚\x1b[0;33m ' + rps.prev + '\x1b[0m';

  // log.now += ' \x1b[1;33m:\x1b[0;33m ' + Math.round( bytes.total / 1048576 ) + 'mb\x1b[0m';
  // log.now += ' \x1b[1;33m:\x1b[0;33m ' + Math.round( bytes.prev / 1048576 ) + 'mb/s\x1b[0m';
  log.now += '\x1b[1;10m :\x1b[0m ' + res.uri;

  if( options && options.tail ){
    process.stderr.write( '\r' + log.now );
    if( log.prev.length > log.now.length ){
      process.stderr.write( new Array( log.prev.length - log.now.length + 1 ).join( ' ' ) );
    }
  }
  else process.stderr.write( log.now + '\n' );
};

module.exports = function( options ){
  return function( huntsman, err, res, cb ){

    lastResponse = new Date().getTime();

    if( err ) stats.errors++;
    else stats.success++;

    if( !( res.statusCode in stats.codes ) ) stats.codes[ res.statusCode ] = 0;
    stats.codes[ res.statusCode ]++;

    if( 'string' === typeof( res.body ) ){
      bytes.now += res.body.length;
      bytes.total += res.body.length;
    }
    emit( this, res, options );

    return cb();
  };
};