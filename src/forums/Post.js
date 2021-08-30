const FormData = require('form-data');
const fetch = require('../lib/request.js');
const parseHTML = require('../lib/parse-html.js');
const isAuthenticated = require('../lib/is-authenticated.js');

/**
 * Represents a forum post
 * @type {Post}
 * @property {string} author The author of the post.
 * @property {Date} postedAt The date object represented the time that the post has been posted at.
 * @property {number} id The id of the post.
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
    let document = rawDOM || '';
    let res = { url: `https://scratch.mit.edu/discuss/m/topic/${topicId}/` };
    if (!rawDOM) {
      res = await fetch(`https://scratch.mit.edu/discuss/m/post/${this.id}/`);

      if (res.status == 403) throw new Error('This post is deleted!');

      const dom = parseHTML(await res.text());

      document = dom.document;
    }
    const source = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/source`,
    ).then((resp) => resp.text());

    const post = document.querySelector(`#post-${this.id}`);
    const header = post.querySelector('header');

    const time = header.querySelector('time');
    const user = header.querySelector('h1');

    this.postedAt = new Date(time.getAttribute('datetime'));
    this.author = user.innerText;
    this.content = {
      html: post.querySelector('.post-content').innerHTML,
      bb: source,
    };

    this.topic = Number(res.url.split('/')[6]);
  }

  async edit(body) {
    isAuthenticated(this);
    const data = new FormData();
    data.append('scratchcsrftoken', this._client.auth.csrfToken);
    data.append('body', body);
    data.append('update', null);

    const res = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/edit/`,
      {
        client: this._client,
        method: 'POST',
        body: data,
      },
    );

    return res.status == 200;
  }
}

module.exports = Post;
