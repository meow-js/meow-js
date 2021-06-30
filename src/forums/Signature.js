const fetch = require("../lib/request.js");
const parseHTML = require("../lib/parse-html.js");
const FormData = require("form-data");
const isAuthenticated = require("../lib/is-authenticated.js");

/**
 * Represents a forum post
 * @type {Post}
 *
 */
class Signature {
  /**
   * Create a Post
   * @param {number} id
   * @param {ScratchSession}
   */
  constructor(_client) {
    this._client = _client;
  }
  /**
   * Loads the post into the object.
   * @param {HTMLDocument} rawDOM
   * @param {number} topicId
   * @private
   * @returns {void}
   */
  async _init() {
    isAuthenticated(this);
    let res = await fetch(
      `https://scratch.mit.edu/discuss/settings/${
        this._client.username
      }/?rnd=${Math.random()}`,
      {
        client: this._client,
      }
    );

    let { document } = parseHTML(await res.text());

    let signature = document.querySelector("#id_signature");

    this.signature = signature.innerText;

    let signatureHTML = document.querySelector(".postsignature");

    this.signatureHTML = signatureHTML.innerHTML;
  }
  /**
   * The signature bbcode.
   * @type {string}
   */
  signature = "";

  /**
   * The html of the signature.
   * @type {string}
   */
  signatureHTML = "";

  /**
   * Updates the signature with the given BBCode.
   * @param {string} body
   * @return {boolean} If the edit is successful or not.
   */
  async update(body) {
    isAuthenticated(this);
    let res = await fetch(
      `https://scratch.mit.edu/discuss/settings/${this._client.username}/`,
      {
        client: this._client,
        method: "POST",
        body: `csrfmiddlewaretoken=${this._client.auth.csrfToken}&signature=${body}&update=`,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.status == 200;
  }
}

module.exports = Signature;
