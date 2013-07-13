
# Huntsman

[![Build Status](https://travis-ci.org/missinglink/huntsman.png?branch=master)](https://travis-ci.org/missinglink/huntsman)

## A super simple web spider

Huntsman takes one or more 'seed' urls with the `spider.queue.add()` method.

Once the process is kicked off with `spider.start()`, it will take care of extracting links from the page and following only the pages we want.

To define which pages are crawled and extract data, use `spider.on()` with a string or regular expression.

Each page will only be crawled once. If muliple regular expressions match the uri, they will all be called.

**Page URLs which do not match an `on` condition will never be crawled**

### Install

```bash
npm install huntsman --save
```

### Example

```javascript
var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'stats' ),
  huntsman.extension( 'recurse' ),
  huntsman.extension( 'cheerio' )
];

spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res, body, $ ){
  console.log({
    uri: res.uri,
    heading: $('h1.firstHeading').text().trim(),
    body: $('div#mw-content-text p').text().trim()
  });
});

spider.queue.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();
```

```bash
peter@edgy:/tmp$ node example.js 
{
  "uri": "http://en.wikipedia.org/wiki/Wikipedia:Recent_additions",
  "heading": "Wikipedia:Recent additions",
  "body": "This is a selection of recently created new articles and greatly expanded former stub articles on Wikipedia that were featured on the Main Page as part of Did you know? You can submit new pages for consideration. (Archives are grouped by month of Main page appearance.)Tip: To find which archive contains the fact that appeared on Did You Know?, return to the article and click \"What links here\" to the left of the article. Then, in the dropdown menu provided for namespace, choose Wikipedia and click \"Go\". When you find \"Wikipedia:Recent additions\" and a number, click it and search for the article name.\n\nCurrent archive"
}

... etc
```