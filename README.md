
# Huntsman

## A super simple web spider

Huntsman take one or more 'seed' urls with the `spider.add()` method.

Once the process is kicked off with `spider.start()`, it will take care of extracting links from the page and following only the pages we want.

To define which pages are crawled and extract data, use `spider.on()` with a string or regular expression.

Each page will only be crawled once. If muliple regular expressions match the uri, they will all be called.

```bash
npm install huntsman --save
```

```javascript
var Huntsman = require('huntsman');
var spider = new Huntsman();

spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/([^\/]*)/, function ( res, $, body ){

  console.log( res.url );
  console.log( $('h1.firstHeading').text().trim() );
  console.log( $('div#mw-content-text p').first().text().trim() );

});

spider.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();
```

```bash
peter@edgy:/tmp$ node example.js 

 -> http://en.wikipedia.org/wiki/Main_Page
Main Page
Percy Fender (1892–1985) was an English cricketer who played 13 Tests and captained Surrey between 1921 and 1931. An all-rounder, he was a belligerent middle-order batsman who bowled mainly leg spin and completed the cricketer's double seven times. In 1914, he was named one of Wisden's Cricketers of the Year, and in 1920 hit the fastest recorded first-class century, reaching three figures in 35 minutes (which remains a record in 2013). In county cricket, he was an effective performer with bat and ball, and a forceful though occasionally controversial leader; contemporaries judged him the best captain in England. From 1921, he played occasionally in Tests for England but was never particularly successful. Despite press promptings, he was never appointed Test captain, and his England career was effectively ended by a clash with the influential Lord Harris in 1924. Further disagreements with the Surrey committee over his approach and tactics led to his replacement as county captain in 1932 and the end of his career in 1935. Cartoonists enjoyed caricaturing his distinctive appearance, but he was also well known outside cricket for his presence in society. (Full article...)

 -> http://en.wikipedia.org/wiki/Wikipedia:General_disclaimer
Wikipedia:General disclaimer
Wikipedia is an online open-content collaborative encyclopedia; that is, a voluntary association of individuals and groups working to develop a common resource of human knowledge. The structure of the project allows anyone with an Internet connection to alter its content. Please be advised that nothing found here has necessarily been reviewed by people with the expertise required to provide you with complete, accurate or reliable information.


```