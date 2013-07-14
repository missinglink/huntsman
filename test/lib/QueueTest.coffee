
Queue = require( '../../lib/Queue' )
breakdown = require 'breakdown'
should = require 'should'

describe 'queue', ->

  describe 'constructor', ->

    it 'should set default values', ->

      queue = new Queue()
      queue.data.should.eql []
      queue.isUnique.should.eql true

    it 'should allow disabling unique', ->

      queue = new Queue( false )
      queue.isUnique.should.eql false

  describe 'has', ->

    it 'should return true for items in the queue', ->

      queue = new Queue()
      queue.add( 'foo' )
      queue.add( 'bar' )
      queue.has( 'foo' ).should.eql true
      queue.has( 'baz' ).should.eql false

  describe 'count', ->

    it 'should return queue length', ->

      queue = new Queue()
      queue.add( 'foo' )
      queue.add( 'bar' )
      queue.count().should.eql 2

  describe 'add', ->

    it 'should add once when unique', ->

      queue = new Queue( true )
      queue.add( 'foo' )
      queue.count().should.eql 1
      queue.add( 'foo' )
      queue.count().should.eql 1

    it 'should add twice when not unique', ->

      queue = new Queue( false )
      queue.add( 'foo' )
      queue.count().should.eql 1
      queue.add( 'foo' )
      queue.count().should.eql 2

  describe 'remove', ->

    it 'should remove all when unique', ->

      queue = new Queue( true )
      queue.add( 'foo' )
      queue.add( 'foo' )
      queue.count().should.eql 1
      queue.remove( 'foo' )
      queue.count().should.eql 0

    it 'should remove one when not unique', ->

      queue = new Queue( false )
      queue.add( 'foo' )
      queue.add( 'foo' )
      queue.count().should.eql 2
      queue.remove( 'foo' )
      queue.count().should.eql 1
      queue.remove( 'goo' )
      queue.count().should.eql 1

  describe 'shift', ->

    it 'should remove an element from the beginning of an array', ->

      queue = new Queue( false )
      queue.add( 'foo' )
      queue.add( 'bar' )
      queue.count().should.eql 2
      queue.shift().should.eql 'foo'
      queue.count().should.eql 1

  describe 'pop', ->

    it 'should remove an element from the end of an array', ->

      queue = new Queue( false )
      queue.add( 'foo' )
      queue.add( 'bar' )
      queue.count().should.eql 2
      queue.pop().should.eql 'bar'
      queue.count().should.eql 1

  describe 'adding things twice', ->

    it 'should not allow you to add things twice when unique', ->

      queue = new Queue( true )
      queue.add( 'foo' )
      queue.count().should.eql 1
      queue.shift()
      queue.count().should.eql 0
      queue.add( 'foo' )
      queue.count().should.eql 0

    it 'should not allow you to add things twice when not unique', ->

      queue = new Queue( false )
      queue.add( 'foo' )
      queue.count().should.eql 1
      queue.shift()
      queue.count().should.eql 0
      queue.add( 'foo' )
      queue.count().should.eql 1