
url = require('url')
request = require('request')
cheerio = require('cheerio')

# absolute: ( href ) ->
#   if href.match /^\/(.*)$/ then return proto + '://' + domain + href
#   return href

linkextractor = ( res, body, transform ) ->
  links = body.match new RegExp 'href=\"([^"]+)', 'gi'
  if Array.isArray links then links = links.map (link) -> url.resolve res.url, link.substr 6
  return links

class Huntsman

  constructor: ( @options ) ->
    @queued = []
    @started = []
    @observers = []

  add: ( uri ) ->
    if @queued.indexOf( uri ) < 0 && @started.indexOf( uri ) < 0
      @queued.push( uri )

  on: ( regex, cb ) ->
    @observers.push({ regex: regex, notify: cb })

  success: ( res, $, body ) =>
    res.links = linkextractor res, body, 'relative'
    @observers.forEach ( observer ) =>

      # Notify Observers
      observer.notify( res, $, body ) if res.url.match observer.regex

      # Add Links to Index
      if Array.isArray res.links
        ( res.links.filter (elem, pos) -> res.links.indexOf(elem) == pos )
          .forEach ( link ) => @add link if link.match observer.regex

  error: ( uri, res, err ) =>
    console.error( 'ERROR', err );

  req: ( uri ) =>
    request uri, ( err, res, body ) =>
      res.url = uri if 'object' is typeof res
      if err then @error res, err
      else @success res, cheerio.load(body, lowerCaseTags:true), body

  start: () =>
    setInterval () =>
      next = @queued.pop()
      if 'string' is typeof next
        @started.push( next )
        @req( next )
    , @options and @options.wait or 50

module.exports = Huntsman