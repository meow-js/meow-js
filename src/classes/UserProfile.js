const fetch = require("../lib/request.js");

class UserProfile {
  /**
   * Creates a UserProfile Object
   * @param {string} name
   * @param {ScratchSession} client
   */
  constructor(name, client) {
    this._username = name;
    this._client = client;
  }

  /**
   * Initializes the UserProfile Object
   */
  async _init() {
    let res = await fetch(
      `https://api.scratch.mit.edu/users/${this._username}`
    );
    let json = await res.json();
    this.loadedObject = json;

    if (this.loadedObject.code == "NotFound") throw new Error("Invalid user");

    this.username = json.username;
    this.id = json.id;
    this.scratchTeam = json.scratchteam;
    this.bio = json.profile.bio;
    this.status = json.profile.status;
  }

  /**
   * The username of the user
   * @type {string}
   */
  username = "";

  /**
   * The user id of the user
   * @type {number}
   */
  id = 0;

  /**
   * If the user is a Scratch Team member or not.
   * @type {boolean}
   */
  scratchTeam = false;

  /**
   * The user's "About me" section.
   * @type {string}
   */
  bio = "";

  /**
   * The user's "What I'm Working On" section.
   * @type {string}
   */
  status = "";
}

module.exports = UserProfile;
