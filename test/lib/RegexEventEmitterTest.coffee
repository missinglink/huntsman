
RegexEventEmitter = require( '../../lib/RegexEventEmitter' );
breakdown = require 'breakdown'
should = require 'should'

describe 'RegexEventEmitter', ->

  it 'listeners', ->

    emitter = new RegexEventEmitter();
    RegexEventEmitter.listeners( emitter ).should.eql 0
    emitter.listeners().length.should.equal 0

  it 'should add listeners with on()', (done) ->

    emitter = new RegexEventEmitter();
    emitter.on( 'foo', done );
    emitter.emit( 'foo' );

  it 'should add listeners with once()', (done) ->

    emitter = new RegexEventEmitter();
    emitter.once( 'foo', done );
    emitter.emit( 'foo' );
    emitter.emit( 'foo' );

  it 'should throw if non string passed to match()', ->

    emitter = new RegexEventEmitter();
    (-> emitter.match( /bar/ ) ).should.throw 'invalid string'

  it 'should match listeners with match()', ->

    emitter = new RegexEventEmitter();
    emitter.on( /bingo|bango/ );
    emitter.once( 'foo' );
    emitter.match( 'bingo' ).should.eql true;
    emitter.match( 'foo' ).should.eql true;
    emitter.match( 'baz' ).should.eql false;

  it 'should emit error when hitting max event listeners', (done) ->

    called = 0
    errevent = ->
      called++
      if called > 1 then throw new Error 'event called too many times'
      if called == 1 then setTimeout done, 10

    emitter = new RegexEventEmitter();
    emitter.setMaxListeners 2
    emitter.on 'error', errevent
    emitter.on /bingo/, console.log
    emitter.listeners().length.should.equal 2
    emitter.on /bango/, console.log
    emitter.listeners().length.should.equal 2

  it 'should allow adding & removing listeners', ->

    emitter = new RegexEventEmitter();
    emitter.on /bingo/, console.log

    RegexEventEmitter.listeners( emitter ).should.eql 1
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 1
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 0
    emitter.listeners().length.should.equal 1
    emitter.listeners( /bingo/ ).length.should.equal 1
    emitter.listeners( /bongo/ ).length.should.equal 0

    emitter.removeListener /bingo/
    
    RegexEventEmitter.listeners( emitter ).should.eql 0
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 0
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 0
    emitter.listeners().length.should.equal 0
    emitter.listeners( /bingo/ ).length.should.equal 0
    emitter.listeners( /bongo/ ).length.should.equal 0

  it 'should allow removing all listeners by regex', ->

    emitter = new RegexEventEmitter();
    emitter.on /bingo/, console.log
    emitter.on /bingo/, console.log
    emitter.on /bongo/, console.log
    emitter.on /bongo/, console.log

    RegexEventEmitter.listeners( emitter ).should.eql 4
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 2
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 2
    emitter.listeners().length.should.equal 4
    emitter.listeners( /bingo/ ).length.should.equal 2
    emitter.listeners( /bongo/ ).length.should.equal 2

    emitter.removeAllListeners /bingo/
    
    RegexEventEmitter.listeners( emitter ).should.eql 2
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 0
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 2
    emitter.listeners().length.should.equal 2
    emitter.listeners( /bingo/ ).length.should.equal 0
    emitter.listeners( /bongo/ ).length.should.equal 2

  it 'should allow removing all listeners', ->

    emitter = new RegexEventEmitter();
    emitter.on /bingo/, console.log
    emitter.on /bingo/, console.log
    emitter.on /bongo/, console.log
    emitter.on /bongo/, console.log

    RegexEventEmitter.listeners( emitter ).should.eql 4
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 2
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 2
    emitter.listeners().length.should.equal 4
    emitter.listeners( /bingo/ ).length.should.equal 2
    emitter.listeners( /bongo/ ).length.should.equal 2

    emitter.removeAllListeners()
    
    RegexEventEmitter.listeners( emitter ).should.eql 0
    RegexEventEmitter.listeners( emitter, /bingo/ ).should.eql 0
    RegexEventEmitter.listeners( emitter, /bongo/ ).should.eql 0
    emitter.listeners().length.should.equal 0
    emitter.listeners( /bingo/ ).length.should.equal 0
    emitter.listeners( /bongo/ ).length.should.equal 0

  it 'functional #1', (done) ->

    emitter = new RegexEventEmitter();
    called = 0

    testvalues = ( arg, arg2 ) ->

      called++
      arg.should.eql 'bingo'
      arg2.should.eql 'bongo'

      RegexEventEmitter.listeners( emitter ).should.eql 1
      RegexEventEmitter.listeners( emitter, /hello (world|universe)/ ).should.eql 1
      RegexEventEmitter.listeners( emitter, /bango/ ).should.eql 0

      if called > 2 then throw new Error 'event called too many times'
      if called == 2
        setTimeout ->
          emitter.removeListener( /hello (world|universe)/ );
          RegexEventEmitter.listeners( emitter ).should.eql 0
          RegexEventEmitter.listeners( emitter, /hello (world|universe)/ ).should.eql 0
          RegexEventEmitter.listeners( emitter, /bango/ ).should.eql 0
          done()
        , 10

    emitter.on /hello (world|universe)/, testvalues
    emitter.emit 'hello testcase', 'bingo', 'bongo'
    emitter.emit 'hello world', 'bingo', 'bongo'
    emitter.emit 'hello universe', 'bingo', 'bongo'

  it 'functional #2', (done) ->

    emitter = new RegexEventEmitter();
    called = 0

    testvalues = ( arg, arg2 ) ->

      called++
      arg.should.eql 'bingo'
      arg2.should.eql 'bongo'

      RegexEventEmitter.listeners( emitter ).should.eql 1
      RegexEventEmitter.listeners( emitter, /hello (world|universe)/ ).should.eql 1
      RegexEventEmitter.listeners( emitter, /bango/ ).should.eql 0

      if called > 1 then throw new Error 'event called too many times'
      if called == 1
        setTimeout ->
          emitter.removeListener( /hello (world|universe)/ );
          RegexEventEmitter.listeners( emitter ).should.eql 0
          RegexEventEmitter.listeners( emitter, /hello (world|universe)/ ).should.eql 0
          RegexEventEmitter.listeners( emitter, /bango/ ).should.eql 0
          done()
        , 10

    emitter.once /hello (world|universe)/, testvalues
    emitter.emit 'hello testcase', 'bingo', 'bongo'
    emitter.emit 'hello world', 'bingo', 'bongo'
    emitter.emit 'hello universe', 'bingo', 'bongo'