const FormData = require('form-data');
const fetch = require('../lib/request.js');
const parseHTML = require('../lib/parse-html.js');
const isAuthenticated = require('../lib/is-authenticated.js');

/**
 * Represents a forum signature
 * @property {string} signature The bbcode of the signature.
 * @property {string} signatureHTML The HTML of the signature.
 */
class Signature {
  /**
   * Initializes the object
   * @param {number} id
   * @param {ScratchSession}
   */
  constructor(_client) {
    this._client = _client;
  }

  /**
   * Loads the signature.
   * @private
   * @returns {void}
   */
  async _init() {
    isAuthenticated(this);
    const res = await fetch(
      `https://scratch.mit.edu/discuss/settings/${
        this._client.username
      }/?rnd=${Math.random()}`,
      {
        client: this._client,
      },
    );

    const { document } = parseHTML(await res.text());

    const signatureHTML = document.querySelector('.postsignature');

    this.signatureHTML = signatureHTML.innerHTML;
    this.signature = signatureHTML.innerText;
  }

  /**
   * Updates the signature with the given BBCode.
   * @param {string} body
   * @return {boolean} If the edit is successful or not.
   */
  async update(body) {
    isAuthenticated(this);
    const res = await fetch(
      `https://scratch.mit.edu/discuss/settings/${this._client.username}/`,
      {
        client: this._client,
        method: 'POST',
        body: `csrfmiddlewaretoken=${this._client.auth.csrfToken}&signature=${body}&update=`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return res.status == 200;
  }
}

module.exports = Signature;
