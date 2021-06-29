const fetch = require("../lib/request.js");

class Project {
  /**
   * Creates the Project Object
   * @param {number} id
   */
  constructor(id) {
    this.id = id;
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
}
