'use strict';

module.exports = Match;

var Transform = require('stream').Transform;
var inherits = require("util").inherits;
var Buffers = require('buffers');

inherits(Match, Transform);

function Match(opts, matchFn) {
  if (!(this instanceof Match)) {
    return new Match(opts, matchFn);
  }

  this._opts = opts;
  if (typeof this._opts.pattern === "string") {
    this._opts.pattern = new Buffer(this._opts.pattern);
  }
  this._matchFn = matchFn;
  this._bufs = Buffers();

  //todo pass along opts
  Transform.call(this);
}

Match.prototype._transform = function (chunk, encoding, callback) {
  var pattern = this._opts.pattern;
  this._bufs.push(chunk);

  var index = this._bufs.indexOf(pattern);
  if (index >= 0) {
    this._matchFn(this._bufs.slice(0, index), pattern);
  } else {
    this._matchFn(this._bufs.slice(0, this._bufs.length - chunk.length), false);
  }
  callback();
};