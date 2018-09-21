const { Transform } = require('stream');
/**
 * Returns a transform stream that replaces
 * 'needle' with 'replacer' in the data piped into it.
 *
 * All read data is converted ot utf-8 strings before
 * the replacement isperformed.
 *
 * Honors needles appearing on chunk boundaries.
 *
 * Abides by the same rules as String.replace();
 *
 * @param  {String|Function} replacerCb replacer
 * @return {Transform}
 */
module.exports = function replaceStream(replacerCb) {
  const ts = new Transform();
  let chunks = [],
    len = 0,
    pos = 0;

  ts._transform = function _transform(chunk, enc, cb) {
    chunks.push(chunk);
    len += chunk.length;

    if (pos === 1) {
      const data = replacerCb(Buffer.concat(chunks, len).toString());

      // TODO: examine and profile garbage
      chunks = [];
      len = 0;

      this.push(data);
    }

    pos = 1 ^ pos;
    cb(null);
  };

  ts._flush = function _flush(cb) {
    if (chunks.length) {
      this.push(replacerCb(Buffer.concat(chunks, len).toString()));
    }

    cb(null);
  };

  return ts;
};
