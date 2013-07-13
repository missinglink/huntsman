
proxy = require( '../../../lib/proxy/mock' );
breakdown = require 'breakdown'
should = require 'should'

describe 'mock proxy', ->

  it 'should hit cache for example fixture', (done) ->

    http = proxy();
    http 'http://www.example.com', ( err, res, body ) ->

      should.not.exist err
      res.uri.should.eql 'http://www.example.com'
      res.statusCode.should.eql 200
      body.should.equal '<html><body>Hello World!</body></html>'
      done()

  it 'should miss cache for random uri', (done) ->

    http = proxy();
    http 'http://www.foo.com', ( err, res, body ) ->

      should.exist err
      err.should.eql 'fixture not found'
      res.uri.should.eql 'http://www.foo.com'
      res.statusCode.should.eql 404
      should.not.exist body
      done()

  it 'should allow cache injection', (done) ->

    http = proxy({
      'http://www.foo.com': {
        err: null,
        res: {
          uri: 'http://www.foo.com',
          statusCode: 200,
          headers: [ 'Content-Type: text/html' ]
        },
        body: '<html><body>Foo Bar!</body></html>'
      }
    });

    http 'http://www.foo.com', ( err, res, body ) ->

      should.not.exist err
      res.uri.should.eql 'http://www.foo.com'
      res.statusCode.should.eql 200
      body.should.equal '<html><body>Foo Bar!</body></html>'
      done()

  it 'should allow cache truncation', (done) ->

    http = proxy({});
    http 'http://www.example.com', ( err, res, body ) ->

      should.exist err
      err.should.eql 'fixture not found'
      res.uri.should.eql 'http://www.example.com'
      res.statusCode.should.eql 404
      should.not.exist body
      done()
