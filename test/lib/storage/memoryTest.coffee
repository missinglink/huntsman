
store = require( '../../../lib/storage/memory' );
breakdown = require 'breakdown'
should = require 'should'

describe 'memory store', ->

  describe 'get', ->

    it 'should return undefined for keys not in cache', ->

      storage = store();
      should.not.exist storage.get('foo')

    it 'should return values for keys in cache', ->

      storage = store();
      storage.set('foo', 'bar');
      storage.get('foo').should.eql 'bar'

  describe 'set', ->

    it 'should set values in cache', ->

      storage = store();
      storage.set('foo', 'bar');
      storage.get('foo').should.eql 'bar'

  describe 'del', ->

    it 'should not error when keys not in cache', ->

      storage = store();
      storage.del('foo')

    it 'should remove keys from cache', ->

      storage = store();
      storage.set('foo', 'bar');
      storage.get('foo').should.eql 'bar'
      storage.del('foo')
      should.not.exist storage.get('foo')