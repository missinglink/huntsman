
proxy = require( '../../../lib/proxy/http' );
breakdown = require 'breakdown'
should = require 'should'

describe.skip 'http proxy', ->

  it 'should use npm request to fetch uris', (done) ->

    http = proxy();
    http 'http://www.example.com', ( err, res, body ) ->

      should.not.exist err
      res.uri.should.eql 'http://www.example.com'
      res.statusCode.should.eql 200
      body.substr(0,15).should.equal '<!doctype html>'
      done()