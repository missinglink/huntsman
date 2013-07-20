
# A super simple web spider

Huntsman takes one or more 'seed' urls with the `spider.queue.add()` method.

Once the process is kicked off with `spider.start()`, it will take care of extracting links from the page and following only the pages we want.

To define which pages are crawled and extract data, use `spider.on()` with a string or regular expression.

Each page will only be crawled once. If multiple regular expressions match the uri, they will all be called.

**Page URLs which do not match an `on` condition will never be crawled**

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

## Extensions

Extensions have default settings, you can override them by passing an optional second argument when the extension is loaded.

```javascript
// loading a module
spider.extensions = [
  huntsman.extension( 'module_name', options )
];
```

### recurse

This extension extracts links from html pages and then adds them to the queue.

The default patterns only target anchor tags which use the http protocol, you can change any of the default patterns by declaring them when the extension is loaded.

```javascript
// default patterns
huntsman.extension( 'recurse', {
  pattern: {
    search: /a\shref\s?=\s?['"]([^"'#]+)/gi,
    refine: /['"]([^"'#]+)/,
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
    search: /(script\ssrc|a\shref)\s?=\s?['"]([^"'#]+)/gi, // anchor or script tags
  }
})
```

```javascript
// avoid some file extensions
huntsman.extension( 'recurse', {
  pattern: {
    filter: /^https?:\/\/.*(?!\.(pdf|png|jpg|gif|zip))....$/, // use lookahead to skip downloads
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

The `res.extension.cheerio` function is available in your `on` callbacks when the response body is valid HTML.

```javascript
spider.on( 'example.com', function ( err, res ){

  // use jquery-style selectors & functions
  var $ = res.extension.cheerio;
  if( !$ ) return; // content is not html

  console.log( res.uri, $('h1').text().trim() );

});
```

`cheerio` reference: https://github.com/MatthewMueller/cheerio

## Build Status

[![Build Status](https://travis-ci.org/missinglink/huntsman.png?branch=master)](https://travis-ci.org/missinglink/huntsman)