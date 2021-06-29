const fetch = require("../lib/request.js");
const parseHTML = require("../lib/parse-html.js");
const Topic = require("./Topic.js");

/**
 * Represents a forum (e.g Questions about Scratch)
 * @type {Forum}
 *
 */
class Forum {
  /**
   * Create a forum post
   * @param {number} id: defaults to 31 ( Advanced Topics :)))) )
   */
  constructor(id = 31) {
    this.forumId = Number(id) || 31;
  }

  /**
   * Loads the forum into the object.
   * @type {function}
   * @returns {void}
   * @private
   */
  async _init() {
    await this.loadNextPage();
  }

  /**
   * Loads the next page of the forum.
   * @type {function}
   * @returns {void}
   */

  async loadNextPage() {
    this.page++;
    let res = await fetch(
      `https://scratch.mit.edu/discuss/m/${this.forumId}/?page=${this.page}`
    );
    let txt = await res.text();
    let { window, document } = parseHTML(txt);
    let topics = Array.from(document.querySelectorAll("ol li"));

    for (let j = 0; j < topics.length; j++) {
      let topic = topics[j];
      let id = Number(topic.querySelector("a").href.split("/")[4]);
      let obj = new Topic(id);
      // This topic is not loaded. It can be loaded with calling the ._init function.

      this.topics.push(obj);
    }
  }

  page = 0;
  topics = [];
}

module.exports = Forum;
