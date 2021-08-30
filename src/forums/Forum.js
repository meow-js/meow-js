const fetch = require('../lib/request.js');
const parseHTML = require('../lib/parse-html.js');
const Topic = require('./Topic.js');

/**
 * Represents a forum (e.g Questions about Scratch)
 * @type {Forum}
 * @property {number} page The current page number.
 * @property {array} topics All the topics, uninitialized.
 */
class Forum {
  /**
   * Create a forum post
   * @param {number} id: defaults to 31 ( Advanced Topics :)))) )
   */
  constructor(id = 31) {
    this.forumId = Number(id) || 31;
    this.page = 0;
    this.topics = [];
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
    const res = await fetch(
      `https://scratch.mit.edu/discuss/m/${this.forumId}/?page=${this.page}`,
    );
    const txt = await res.text();
    const { window, document } = parseHTML(txt);
    const topics = Array.from(document.querySelectorAll('ol li'));

    for (let j = 0; j < topics.length; j++) {
      const topic = topics[j];
      const id = Number(topic.querySelector('a').href.split('/')[4]);
      const obj = new Topic(id);
      // This topic is not loaded. It can be loaded with calling the ._init function.

      this.topics.push(obj);
    }
  }
}

module.exports = Forum;
