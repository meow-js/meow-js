const fetch = require("../lib/request.js");

class Project {
  /**
   * Creates the Project Object
   * @param {number} id
   */
  constructor(id, client) {
    this.id = id;
    this._client = client;
  }

  /**
   * Loads the project into the object.
   */
  async _init() {
    let res = await fetch(`https://api.scratch.mit.edu/projects/${this.id}/`);
    let data = await res.json();

    this.title = data.title;
    this.description = data.description;
    this.instructions = data.instructions;
    this.public = data.instructions;
    this.commentsAllowed = data.comments_allowed;
    this.author = "";
  }

  async setThumbnail(stream) {
    let res = await fetch(`https://scratch.mit.edu/internalapi/project/thumbnail/${this.id}/set`, {
      client: this._client,
      method: "POST",
      body: stream
    })

    return res.status !== 403
  }
}

module.exports = Project