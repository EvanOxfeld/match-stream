var test = require('tap').test;
var streamBuffers = require("stream-buffers");
var MatchStream = require('../');

test("matchFn callback test: has match, source stream arrives as one big chunk", function (t) {
  t.plan(4);

  var sourceStream = new streamBuffers.ReadableStreamBuffer();
  sourceStream.put("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  var writableStream = new streamBuffers.WritableStreamBuffer();

  var ms = new MatchStream({ pattern: ', '}, function (buf, matched, extra) {
    t.equal(buf.toString(), 'Lorem ipsum dolor sit amet');
    t.equal(matched.toString(), ', ');
    t.equal(extra.toString(), ', consectetur adipiscing elit');
  });

  sourceStream
    .pipe(ms)
    .pipe(writableStream)
    .on('finish', function () {
      t.pass('should finish stream');
    });
  setImmediate(sourceStream.stop.bind(sourceStream));
});

test("matchFn callback test: no match, source stream arrives as one big chunk", function (t) {
  t.plan(4);

  var ms = new MatchStream({ pattern: '*'}, function (buf, matched, extra) {
    t.equal(buf.toString(), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
    t.equal(matched, undefined);
    t.equal(extra, undefined);
  });

  var sourceStream = new streamBuffers.ReadableStreamBuffer();
  sourceStream.put("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  var writableStream = new streamBuffers.WritableStreamBuffer();

  sourceStream
    .pipe(ms)
    .pipe(writableStream)
    .on('finish', function () {
      t.pass('should finish stream');
    });
  setImmediate(sourceStream.stop.bind(sourceStream));
});

test("output stream test, output contains pushed content from matchFn callback: has match, source stream arrives as one big chunk", function (t) {
  t.plan(1);

  var sourceStream = new streamBuffers.ReadableStreamBuffer();
  sourceStream.put("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  var writableStream = new streamBuffers.WritableStreamBuffer();

  var ms = new MatchStream({ pattern: ', '}, function (buf, matched, extra) {
    this.push(buf);
  });

  sourceStream
    .pipe(ms)
    .pipe(writableStream)
    .on('finish', function () {
      var str = writableStream.getContentsAsString('utf8');
      t.equal(str, 'Lorem ipsum dolor sit amet');
    });
  setImmediate(sourceStream.stop.bind(sourceStream));
});

test("output stream test, output is empty: no match, source stream arrives as one big chunk", function (t) {
  t.plan(1);

  var sourceStream = new streamBuffers.ReadableStreamBuffer();
  sourceStream.put("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  var writableStream = new streamBuffers.WritableStreamBuffer();

  var ms = new MatchStream({ pattern: '*'}, function (buf, matched, extra) {
    this.push(buf);
  });

  sourceStream
    .pipe(ms)
    .pipe(writableStream)
    .on('finish', function () {
      t.equal(writableStream.getContents().toString(), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
    });
  setImmediate(sourceStream.stop.bind(sourceStream));
});

test("matchFn callback test: has match, source stream arrives in pieces breaking, with the pattern being bigger than some chunk sizes", function (t) {
  t.plan(2);

  var sourceStream = new streamBuffers.ReadableStreamBuffer({ chunkSize: 2 });
  sourceStream.put("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  var writableStream = new streamBuffers.WritableStreamBuffer();

  var ms = new MatchStream({ pattern: 'amet, '}, function (buf, matched, extra) {
    if (matched) {
      t.pass('should find a match');
    }
  });

  sourceStream
    .pipe(ms)
    .pipe(writableStream)
    .on('finish', function () {
      t.pass('should finish stream');
    });
  setImmediate(sourceStream.stop.bind(sourceStream));
});
