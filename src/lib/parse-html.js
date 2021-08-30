// const { parseHTML } = require("linkedom");
const { parse } = require('node-html-parser');

/**
 * @typedef HTMLParserReturnObj
 * @property {HTMLDocument} document
 */
/**
 * @param {string} html
 * @returns {HTMLParserReturnObj}
 */
module.exports = (html) => {
  const document = parse(html);
  return { document };
}; // Keep it there for backwards compatibillity
