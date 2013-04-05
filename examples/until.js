var MatchStream = require('../');
var streamBuffers = require("stream-buffers");

var theExtra;
var ms = new MatchStream({ pattern: 'World'}, function (buf, matched) {
  if (!matched) {
    return this.push(buf);
  }
  this.push(buf);
  return this.push(null); //signal end of data
}, function (extra) {
  console.log('Data after pattern occurs:', "'" + extra + "'");
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
//Data after pattern occurs: 'World'
//Piped data before pattern occurs: 'Hello '