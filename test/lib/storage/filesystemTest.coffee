
store = require( '../../../lib/storage/filesystem' );
breakdown = require 'breakdown'
should = require 'should'

path = require('path');
tempfilename = path.resolve( './test.json' );

describe.skip 'filesystem store', ->

  describe 'constructor', ->

    it 'should throw on invalid file name', ->

      (-> store null ).should.throw 'invalid file name'

    it 'should return error if file does not exist', (done) ->

      store 'not_exist.file', null, ( err ) ->
        console.log( 'moo', err, storage );
        err.code.should.eql 'invalid file name'
        done()