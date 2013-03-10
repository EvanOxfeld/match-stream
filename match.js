'use strict';

module.exports = Match;

var Transform = require('stream').Transform;
var inherits = require("util").inherits;
var Buffers = require('buffers');

if (!Transform) {
  Transform = require('readable-stream/transform');
}

inherits(Match, Transform);

function Match(opts, matchFn) {
  if (!(this instanceof Match)) {
    return new Match(opts, matchFn);
  }

  //todo - better handle opts e.g. pattern.length can't be > highWaterMark
  this._opts = opts;
  if (typeof this._opts.pattern === "string") {
    this._opts.pattern = new Buffer(this._opts.pattern);
  }
  this._matchFn = matchFn;
  this._bufs = Buffers();

  Transform.call(this);
}

Match.prototype._transform = function (chunk, encoding, callback) {
  var pattern = this._opts.pattern;
  this._bufs.push(chunk);

  var index = this._bufs.indexOf(pattern);
  if (index >= 0) {
    this._matchFn(this._bufs.splice(0, index).toBuffer(), pattern, this._bufs.toBuffer());
  } else {
    this._matchFn(this._bufs.splice(0, this._bufs.length - chunk.length));
  }
  callback();
};
