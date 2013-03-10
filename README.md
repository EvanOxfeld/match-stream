match-stream [![Build Status](https://travis-ci.org/EvanOxfeld/match-stream.png)](https://travis-ci.org/EvanOxfeld/match-stream)
============

Supply a function to handle pattern matches within a NodeJS stream.

## Installation

```bash
$ npm install match-stream
```

## Quick Example

```javascript
var MatchStream = require('../match');
var streamBuffers = require("stream-buffers");

var ms = new MatchStream({ pattern: 'World'}, function (buf, matched, extra) {
  if (!matched) {
    return this.push(buf);
  }
  this.push(buf);
  return this.push(null); //end the stream
});

var sourceStream = new streamBuffers.ReadableStreamBuffer();
sourceStream.put("Hello World");
var writableStream = new streamBuffers.WritableStreamBuffer();

sourceStream
  .pipe(ms)
  .pipe(writableStream)
  .once('close', function () {
    var str = writableStream.getContentsAsString('utf8');
    console.log('Piped data before pattern occurs:', "'" + str + "'");
    sourceStream.destroy();
  });

//Output
//Piped data before pattern occurs: 'Hello '
```

## License

MIT

## Acknowledgements

Special thanks to @wanderview for assisting with the API.

