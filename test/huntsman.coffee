
huntsman = require( '../../huntsman' );
should = require 'should'
semver = require 'semver'

exists = (interval) ->
    if semver.lt process.version, '0.9.0'
        return !!interval.ontimeout
    else
        return !!interval._idleNext && !!interval._idlePrev

describe 'huntsman', ->

  describe 'stop', ->

    it 'should clear event loop before emitting exit', (done) ->

        spider = huntsman.spider()

        spider.loop = setInterval ( () -> done ), 1
        exists( spider.loop ).should.be.ok
        
        spider.on 'exit', ->
            exists( spider.loop ).should.not.be.ok
            done()

        spider.stop()