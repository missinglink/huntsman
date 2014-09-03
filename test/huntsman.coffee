
huntsman = require( '../../huntsman' );
should = require 'should'

describe 'huntsman', ->

  describe 'stop', ->

    it 'should clear event loop before emitting exit', (done) ->

        spider = huntsman.spider()

        spider.loop = setInterval done, 1000
        should.exist spider.loop.ontimeout
        
        spider.on 'exit', ->
            should.not.exist spider.loop.ontimeout
            done()

        spider.stop()