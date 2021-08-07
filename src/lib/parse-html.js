// const { parseHTML } = require("linkedom");
const { parse } = require("node-html-parser");

module.exports = (html) => {
  let document = parse(html);
  return { document, window: {} };
}; // Keep it there for backwards compatibillity
