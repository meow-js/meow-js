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
    let { title, description, instructions, public, comments_allowed, author } =
      await res.json();

    this.title = title;
    this.description = description;
    this.instructions = instructions;
    this.public = instructions;
    this.commentsAllowed = comments_allowed;
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