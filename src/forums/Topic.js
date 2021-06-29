const fetch = require("../lib/request.js");
const parseHTML = require("../lib/parse-html.js");
const Post = require("./Post.js");

/** Represents a forum topic.
 * @type {Topic}
 */
class Topic {
  /**
   * Creates a Topic
   * @param {number} id
   */
  constructor(id) {
    this.id = id;
  }

  /**
   * A document that represents the current topic page.
   * @type {HTMLDocument}
   */
  dom = {};

  /**
   * The first post of the topic (the first post you see on the first page)
   * @type {Post}
   */
  firstPost = {};

  /**
   * The Posts indexed by the object.
   * @type {array}
   */
  posts = [];

  /**
   * The current page number of the topic
   * @type {number}
   */
  page = 0;

  /**
   * Loads the topic into the object.
   * @type {function}
   * @returns {void}
   * @private
   */
  async _init() {
    await this.loadNextPage();
    this.firstPost = this.posts[0];
  }

  /**
   * Loads the next page of posts, and adds them to the posts array.
   * @type {function}
   */
  async loadNextPage() {
    this.page++;
    let res = await fetch(
      `https://scratch.mit.edu/discuss/m/topic/${this.id}?page=${this.page}`
    );
    let { window, document } = parseHTML(await res.text());
    this.dom = document;
    // Insert posts

    let posts = Array.from(document.querySelectorAll("article"));

    if (posts.length <= 0)
      throw new Error("You cannot fetch a empty topic page!");

    for (let j in posts) {
      let post = posts[j];
      let id = Number(post.getAttribute("id").replace(/\D/g, ""));
      let obj = new Post(id);

      await obj._init(document, this.id);

      this.posts.push(obj);
    }
  }
}

module.exports = Topic;
