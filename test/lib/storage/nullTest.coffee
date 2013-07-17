
store = require( '../../../lib/storage/null' );
breakdown = require 'breakdown'
should = require 'should'

describe 'null store', ->

  describe 'get', ->

    it 'should return null', ->

      storage = store();
      storage.set('foo')
      should.not.exist storage.get('foo')

  describe 'set', ->

    it 'should return null', ->

      storage = store();
      should.not.exist storage.set('foo')

  describe 'del', ->

    it 'should return null', ->

      storage = store();
      storage.set('foo')
      should.not.exist storage.del('foo')