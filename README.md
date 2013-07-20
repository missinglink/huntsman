
### Install

```bash
npm install huntsman --save
```

[![NPM](https://nodei.co/npm/huntsman.png?downloads=true&stars=true)](https://nodei.co/npm/huntsman/)

### Example Script

```javascript
/** Crawl wikipedia and use jquery syntax to extract information from the page **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ) // load cheerio extension
];

// follow pages which match this uri regex
spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res ){

  // use jquery-style selectors & functions
  var $ = res.extension.cheerio;
  if( !$ ) return; // content is not html

  // extract information from page body
  var wikipedia = {
    uri: res.uri,
    heading: $('h1.firstHeading').text().trim(),
    body: $('div#mw-content-text p').text().trim()
  };

  console.log( wikipedia );

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.start();
```

### Example Output

```bash
peter@edgy:/tmp$ node examples/html.js 
{
  "uri": "http://en.wikipedia.org/wiki/Wikipedia:Recent_additions",
  "heading": "Wikipedia:Recent additions",
  "body": "This is a selection of recently created new articles and greatly expanded former stub articles on Wikipedia that were featured on the Main Page as part of Did you know? You can submit new pages for consideration. (Archives are grouped by month of Main page appearance.)Tip: To find which archive contains the fact that appeared on Did You Know?, return to the article and click \"What links here\" to the left of the article. Then, in the dropdown menu provided for namespace, choose Wikipedia and click \"Go\". When you find \"Wikipedia:Recent additions\" and a number, click it and search for the article name.\n\nCurrent archive"
}

... etc
```

More examples are available in the [/examples](https://github.com/missinglink/huntsman/tree/master/examples "Title") directory

---

## How it works

Huntsman takes one or more 'seed' urls with the `spider.queue.add()` method.

Once the process is kicked off with `spider.start()`, it will take care of extracting links from the page and following only the pages we want.

To define which pages are crawled use the `spider.on()` function with a string or regular expression.

Each page will only be crawled once. If multiple regular expressions match the uri, they will all be called.

**Page URLs which do not match an `on` condition will never be crawled**

---

## Configuration

The spider has default settings, you can override them by passing a settings object when you create a spider.

```javascript
// use default settings
var huntsman = require('huntsman');
var spider = huntsman.spider();
```

```javascript
// override default settings
var huntsman = require('huntsman');
var spider = huntsman.spider({
  throttle: 10, // maximum requests per second
  timeout: 5000 // maximum gap of inactivity before exiting (in milliseconds)
});
```

---

## Crawling a site

How you configure your spider will vary from site to site, generally you will only be looking for for pages with a specific url format.

### Scrape product information from amazon

In this example we can see that amazon product uris all seem to share the format `'/gp/product/'`.

After queueing the seed uri `http://www.amazon.co.uk/` huntsman will follow all the product pages it finds recursively.

```javascript
/** Example of scraping products from the amazon website **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ) // load cheerio extension
];

// target only product uris
spider.on( '/gp/product/', function ( err, res ){

  if( !res.extension.cheerio ) return; // content is not html
  var $ = res.extension.cheerio;

  // extract product information
  var product = {
    uri: res.uri,
    heading: $('h1.parseasinTitle').text().trim(),
    image: $('img#main-image').attr('src'),
    description: $('#productDescription').text().trim().substr( 0, 50 )
  };

  console.log( product );

});

spider.queue.add( 'http://www.amazon.co.uk/' );
spider.start();
```

### Find pets for sale on cragslist in london 

More complex crawls may require you to specify hub pages to follow before you can get to the content you really want. You can add an `on` event without a callback & huntsman will still follow and extract links from it.

```javascript
/** Example of scraping information about pets for sale on cragslist in london **/

var huntsman = require('huntsman');
var spider = huntsman.spider({
  throttle: 2
});

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ), // load cheerio extension
  huntsman.extension( 'stats' ) // load stats extension
];

// target only pet uris
spider.on( /\/pet\/(\w+)\.html$/, function ( err, res ){

  if( !res.extension.cheerio ) return; // content is not html
  var $ = res.extension.cheerio;

  // extract listing information
  var listing = {
    heading: $('h2.postingtitle').text().trim(),
    uri: res.uri,
    image: $('img#iwi').attr('src'),
    description: $('#postingbody').text().trim().substr( 0, 50 )
  };

  console.log( listing );

});

// hub pages
spider.on( /http:\/\/london\.craigslist\.co\.uk$/ );
spider.on( /\/pet$/ );

spider.queue.add( 'http://www.craigslist.org/about/sites' );
spider.start();
```

---

## Extensions

Extensions have default settings, you can override them by passing an optional second argument when the extension is loaded.

```javascript
// loading an extension
spider.extensions = [
  huntsman.extension( 'extension_name', options )
];
```

### recurse

This extension extracts links from html pages and then adds them to the queue.

The default patterns only target anchor tags which use the http protocol, you can change any of the default patterns by declaring them when the extension is loaded.

```javascript
// default patterns
huntsman.extension( 'recurse', {
  pattern: {
    search: /href\s?=\s?['"]([^"'#]+)/gi,
    refine: /['"]([^"'#]+)$/,
    filter: /^https?:\/\//
  }
})
```

- `search` must be a `global` regexp and is used to target the links we want to extract.
- `refine` is a regexp used to extract the bits we want from the `search` regex matches.
- `filter` is a regexp that must match or links are discarded.


```javascript
// extract both anchor tags and script tags
huntsman.extension( 'recurse', {
  pattern: {
    search: /(href|script([^>]+)src)\s?=\s?['"]([^"'#]+)/gi, // anchor or script tags
  }
})
```

```javascript
// avoid some file extensions
huntsman.extension( 'recurse', {
  pattern: {
    filter: /^https?:\/\/.*(?!\.(pdf|png|jpg|gif|zip))....$/, // regex lookahead
  }
})
```

```javascript
// stay on one domain
huntsman.extension( 'recurse', {
  pattern: {
    filter: /^https?:\/\/www.example.com/, // uris must be prefixed with this domain
  }
})
```

By default `recurse` converts relative urls to absolute urls and strips fragment identifiers and trailing slashes.

If you need even more control you can override the `resolver` & `normaliser` functions to modify these behaviours.

### cheerio

This extension parses html and provides jquery-style selectors & functions.

```javascript
// default settings
huntsman.extension( 'cheerio', { lowerCaseTags: true } )
```

The `res.extension.cheerio` function is available in your `on` callbacks when the response body is HTML.

```javascript
spider.on( 'example.com', function ( err, res ){

  // use jquery-style selectors & functions
  var $ = res.extension.cheerio;
  if( !$ ) return; // content is not html

  console.log( res.uri, $('h1').text().trim() );

});
```

`cheerio` reference: https://github.com/MatthewMueller/cheerio

### json

This extension parses the response body with `JSON.parse()`.

```javascript
// enable json
huntsman.extension( 'json' )
```

The `res.extension.json` function is available in your `on` callbacks when the response body is json.

```javascript
spider.on( 'example.com', function ( err, res ){

  var json = res.extension.json;
  if( !json ) return; // content is not json

  console.log( res.uri, json );

});
```

### links

This extension extracts links from html pages and returns the result.

It exposes the functionality that the `recurse` extension uses to extract links.

```javascript
// enable extension
huntsman.extension( 'links' )
```

The `res.extension.links` function is available in your `on` callbacks when the response body is a string.

```javascript
spider.on( 'example.com', function ( err, res ){

  if( !res.extension.links ) return; // content is not a string

  // extract all image tags from body
  var images = res.extension.links({
    pattern: {
      search: /(img([^>]+)src)\s?=\s?['"]([^"'#]+)/gi, // extract img tags
      filter: /\.jpg|\.gif|\.png/i // filter file types
    }
  });

  console.log( images );

});
```

### stats

This extension displays statistics about pages crawled, error counts etc.

```javascript
// default settings
huntsman.extension( 'stats', { tail: false } )
```

---

## Custom queues and response storage adapters

I'm currently working on being able to persist the job queue via something like redis and potentially caching http responses in mongo with a TTL.

If you live life on the wild side, these adapters can be configured when you create a spider.

Pull requests welcome.

---

## Build Status

[![Build Status](https://travis-ci.org/missinglink/huntsman.png?branch=master)](https://travis-ci.org/missinglink/huntsman)