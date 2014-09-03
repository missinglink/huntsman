
huntsman = require( '../../huntsman' );
should = require 'should'

describe 'huntsman', ->

  describe 'stop', ->

    it 'should clear event loop before emitting exit', (done) ->

        spider = huntsman.spider()

        spider.loop = setInterval ( () -> done ), 1
        should.exist spider.loop._idleNext
        should.exist spider.loop._idlePrev
        
        spider.on 'exit', ->
            should.not.exist spider.loop._idleNext
            should.not.exist spider.loop._idlePrev
            done()

        spider.stop()