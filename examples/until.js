var MatchStream = require('../match');
var streamBuffers = require("stream-buffers");

var ms = new MatchStream({ pattern: 'World'}, function (buf, matched) {
  if (!matched) {
    return this.push(buf);
  }
  this.push(buf);
  return this.push(null); //end the stream
});

var sourceStream = new streamBuffers.ReadableStreamBuffer();
sourceStream.put("Hello World");
ms.once('finish', function () {
  sourceStream.destroy();
});

var writableStream = new streamBuffers.WritableStreamBuffer();

sourceStream.pipe(ms).pipe(writableStream);

writableStream.once('close', function () {
  var str = writableStream.getContentsAsString('utf8');
  console.log('Piped data before pattern occurs:', "'" + str + "'");
});

//Output
//Piped data before pattern occurs: 'Hello '