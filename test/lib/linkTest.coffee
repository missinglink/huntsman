
link = require( '../../lib/link' );
breakdown = require 'breakdown'
should = require 'should'

describe 'normaliser', ->

  describe 'validation', ->

    it 'should throw if uri is invalid', ->

      (-> link.normaliser( '' ) ).should.throw 'invalid uri';
      (-> link.normaliser( null ) ).should.throw 'invalid uri';
      (-> link.normaliser( undefined ) ).should.throw 'invalid uri';
      (-> link.normaliser( {} ) ).should.throw 'invalid uri';
      (-> link.normaliser( [] ) ).should.throw 'invalid uri';
      (-> link.normaliser( 'a' ) ).should.not.throw();

  describe 'transformations', ->

    it 'should remove trailing slashes', ->

      link.normaliser( '/' ).should.eql ''
      link.normaliser( 'http://a.com/foo' ).should.eql 'http://a.com/foo' # no trailing slash
      link.normaliser( 'http://a.com/foo/#bingo' ).should.eql 'http://a.com/foo#bingo'
      link.normaliser( 'http://a.com/foo/#bingo/' ).should.eql 'http://a.com/foo#bingo'
      link.normaliser( 'http://a.com/foo/?bing=bang' ).should.eql 'http://a.com/foo?bing=bang'
      link.normaliser( 'http://a.com/foo/?bing=bang#moo' ).should.eql 'http://a.com/foo?bing=bang#moo'
      link.normaliser( 'http://a.com/foo/bar/' ).should.eql 'http://a.com/foo/bar'

describe 'resolver', ->

  describe 'validation', ->

    it 'should throw if uri is invalid', ->

      (-> link.resolver( '' ) ).should.throw 'invalid uri';
      (-> link.resolver( null ) ).should.throw 'invalid uri';
      (-> link.resolver( undefined ) ).should.throw 'invalid uri';
      (-> link.resolver( {} ) ).should.throw 'invalid uri';
      (-> link.resolver( [] ) ).should.throw 'invalid uri';
      (-> link.resolver( 'a' ) ).should.not.throw();

  describe 'absolute / relative urls', ->

    it 'should not convert relative url to absolute urls if base url not provided', ->

      link.resolver( '/1.html' ).should.eql '/1.html'

    it 'should not convert absolute urls if base url not provided', ->

      link.resolver( 'http://www.example.com/1.html' ).should.eql 'http://www.example.com/1.html'

    it 'should convert relative url to absolute urls when base url is provided', ->

      link.resolver( '/1.html', 'http://example.com/' ).should.eql 'http://example.com/1.html'
      link.resolver( '1.html', 'http://example.com/a' ).should.eql 'http://example.com/1.html'
      link.resolver( '1.html', 'http://example.com/a/' ).should.eql 'http://example.com/a/1.html'

    it 'should not convert domains for absolute urls when a base url is provided', ->

      link.resolver( 'http://example.com/1.html', 'http://foo.com/' ).should.eql 'http://example.com/1.html'

    it 'should resolve parent directory references', ->

      link.resolver( '../2.html', 'http://example.com/a/1.html' ).should.eql 'http://example.com/2.html'

describe 'extractor', ->

  describe 'source parsing', ->

    it 'should accept single and double quote attributes', ->

      link.extractor( 'http://example.com/', '<a href="/1.html">1</a>'+"<a href='/2.html'>2</a>" )
      .should.eql [ 'http://example.com/1.html', 'http://example.com/2.html' ]

  describe 'search & refine patterns', ->

    describe 'default patterns', ->

      it 'should only refine anchor links', ->

        link.extractor( 'http://example.com/', '<script src="/1.js">1</a><a href="/2.html">2</a>' )
        .should.eql [ 'http://example.com/2.html' ]

    describe 'should be overridable', ->

      it 'should allow script tags src to be extracted', ->

        link.extractor( 'http://example.com/', '<script src="/1.js#foo">1</a><a href="/2.html">2</a>', {
          pattern: {
            search: /script\ssrc\s?=\s?['"]([^"']+)/gi, # extract script tags and allow fragment hash
            refine: /['"]([^"']+)/ # allow fragment hash
          }
        })
        .should.eql [ 'http://example.com/1.js#foo' ]

  describe 'filter pattern', ->

    describe 'default pattern', ->

      it 'should not filter by domain (or apply any filtering)', ->

        link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://b.com/2.html">2</a>' )
        .should.eql [ 'http://a.com/1.html', 'http://b.com/2.html' ]

    describe 'should be overridable', ->

      it 'should allow domain filtering', ->

        link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://b.com/2.html">2</a>', {
          pattern: {
            filter: 'http://a.com'
          }
        })
        .should.eql [ 'http://a.com/1.html' ]

      it 'should allow file extension filtering', ->

        link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://b.com/2.jpg">2</a>', {
          pattern: {
            filter: /\.jpg|\.gif|\.png/ # images only
          }
        })
        .should.eql [ 'http://b.com/2.jpg' ]

  describe 'unique option', ->

    it 'should default unique filtering to enabled', ->

      link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://a.com/1.html">1</a>' )
      .should.eql [ 'http://a.com/1.html' ]

    it 'should allow unique filtering to be disabled', ->

      link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://a.com/1.html">1</a>', {
        unique: false
      })
      .should.eql [ 'http://a.com/1.html', 'http://a.com/1.html' ]

    it 'should allow unique filtering to be enabled', ->

      link.extractor( null, '<a href="http://a.com/1.html">1</a><a href="http://a.com/1.html">1</a>', {
        unique: true
      })
      .should.eql [ 'http://a.com/1.html' ]

  describe 'custom link resolver', ->

    it 'should be able to override resolver', ->

      link.extractor( 'http://a.com', '<a href="1.html">1</a>', {
        resolver: ( url, baseUri ) -> return url # just return the url without modification
      })
      .should.eql [ '1.html' ]

  describe 'custom link normaliser', ->

    it 'should be able to override normaliser', ->

      link.extractor( 'http://a.com', '<a href="1.html">1</a>', {
        normaliser: ( url ) -> return url.replace /\.\w*$/, '' # remove file extension
      })
      .should.eql [ 'http://a.com/1' ]