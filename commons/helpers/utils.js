// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

module.exports = {
  keyify(str) {
    str = str.replace(/[^a-zA-Z ]/g, "");
    str = str.replace(/\s+/g, '-');
    return str.toLowerCase();
  },

  removeSpecialCharecters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, "");
  },

  sleep(time) {
    if ((time == null)) { time = 1000; }
    return new Promise((resolve, reject) => {
      const fn = () => resolve();
      return setTimeout(fn, time);
    });
  }
};