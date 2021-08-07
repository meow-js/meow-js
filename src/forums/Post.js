const fetch = require("../lib/request.js");
const parseHTML = require("../lib/parse-html.js");
const FormData = require("form-data");
const isAuthenticated = require("../lib/is-authenticated.js");

/**
 * Represents a forum post
 * @type {Post}
 *
 */
class Post {
  /**
   * Create a Post
   * @param {number} id
   * @param {ScratchSession}
   */
  constructor(id, _client) {
    this.id = id;
    this._client = _client;
  }
  /**
   * Loads the post into the object.
   * @param {HTMLDocument} rawDOM
   * @param {number} topicId
   * @private
   * @returns {void}
   */
  async _init(rawDOM, topicId = 0) {
    var document = rawDOM || "";
    var res = { url: `https://scratch.mit.edu/discuss/m/topic/${topicId}/` };
    if (!rawDOM) {
      res = await fetch(`https://scratch.mit.edu/discuss/m/post/${this.id}/`);

      if (res.status == 403) throw new Error("This post is deleted!");

      let dom = parseHTML(await res.text());

      document = dom.document;
    }
    let source = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/source`
    ).then((resp) => resp.text());

    let post = document.querySelector(`#post-${this.id}`);
    let header = post.querySelector("header");

    let time = header.querySelector("time");
    let user = header.querySelector("h1");

    this.postedAt = time.getAttribute("datetime");
    this.author = user.innerText;
    this.content = {
      html: post.querySelector(".post-content").innerHTML,
      bb: source,
    };

    this.topic = Number(res.url.split("/")[6]);
  }
  /**
   * The author of the post.
   * @type {string}
   */
  author = "";
  /**
   * The time the post was created.
   * @type {string}
   */
  postedAt = "";

  /**
   * The id of the post.
   * @type {number}
   */
  id = 0;

  async edit(body) {
    isAuthenticated(this);
    const data = new FormData();
    data.append("scratchcsrftoken", this._client.auth.csrfToken);
    data.append("body", body);
    data.append("update", null);

    let res = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/edit/`,
      {
        client: this._client,
        method: "POST",
        body: data,
      }
    );

    return res.status == 200;
  }
}

module.exports = Post;
