
link = require( '../../lib/link' );
breakdown = require 'breakdown'
should = require 'should'

describe 'normaliser', ->

  describe 'transformations', ->

    it 'should remove trailing slashes', ->

      link.normaliser( '/' ).should.eql ''
      link.normaliser( 'http://a.com/foo' ).should.eql 'http://a.com/foo' # no trailing slash
      link.normaliser( 'http://a.com/foo/#bingo' ).should.eql 'http://a.com/foo#bingo'
      link.normaliser( 'http://a.com/foo/#bingo/' ).should.eql 'http://a.com/foo#bingo'
      link.normaliser( 'http://a.com/foo/?bing=bang' ).should.eql 'http://a.com/foo?bing=bang'
      link.normaliser( 'http://a.com/foo/?bing=bang#moo' ).should.eql 'http://a.com/foo?bing=bang#moo'
      link.normaliser( 'http://a.com/foo/bar/' ).should.eql 'http://a.com/foo/bar'

  describe 'absolute / relative urls', ->

    it 'should not convert relative url to absolute urls if base url not provided', ->

      link.normaliser( '/1.html' ).should.eql '/1.html'

    it 'should not convert absolute urls if base url not provided', ->

      link.normaliser( 'http://www.example.com/1.html' ).should.eql 'http://www.example.com/1.html'

    it 'should convert relative url to absolute urls when base url is provided', ->

      link.normaliser( '/1.html', 'http://example.com/' ).should.eql 'http://example.com/1.html'

    it 'should not convert domains for absolute urls when a base url is provided', ->

      link.normaliser( 'http://example.com/1.html', 'http://foo.com/' ).should.eql 'http://example.com/1.html'

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
            search: /script\ssrc\s?=\s?['"]([^"']+)/gi, # extract script tags and allow fragement hash
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