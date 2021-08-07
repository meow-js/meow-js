const fetch = require("../lib/request.js");
const UserProfile = require("./UserProfile.js");

/**
 * A Project.
 * @property {number} id The ID of the project.
 * @property {string} title The title of the project.
 * @property {string} description The description (Notes and Credits) section of the project.
 * @property {string} instructions The instructions section of the project.
 * @property {boolean} public A boolean that represents if the project is shared.
 * @property {boolean} commentsAllowed A boolean that represents if the project has comments open.
 *
 */
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
   * @private
   */
  async _init() {
    let res = await fetch(`https://api.scratch.mit.edu/projects/${this.id}/`);
    let data = await res.json();

    this.title = data.title;
    this.description = data.description;
    this.instructions = data.instructions;
    this.public = data.is_published;
    this.commentsAllowed = data.comments_allowed;
    this.author = new UserProfile(data.author.username);
    await this.author._init();
  }

  /**
   * Sets the Project's Thumbnail.
   * @param {Stream} stream
   * @returns {boolean} The result of the API request.
   */
  async setThumbnail(stream) {
    let res = await fetch(
      `https://scratch.mit.edu/internalapi/project/thumbnail/${this.id}/set`,
      {
        client: this._client,
        method: "POST",
        body: stream,
      }
    );

    return res.status !== 403;
  }
}

module.exports = Project;
