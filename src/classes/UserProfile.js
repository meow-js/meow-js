const fetch = require("../lib/request.js");

/**
 * A class to represent a User.
 * @property {string} username The username of the user.
 * @property {number} id The user id of the user.
 * @property {boolean} scratchteam A boolean that represents the user is part of the scratch team.
 * @property {string} bio The "About me" section of a userpage.
 * @property {string} status The WIWO of the user.
 */
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
   * @private
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
   * Loads the ocular status of the user.
   * @returns {object} The ocular status object of the user.
   */
  async getOcularStatus() {
    let res = await fetch(
      `https://my-ocular.jeffalo.net/api/user/${this.username}`
    );
    return await res.json();
  }
}

module.exports = UserProfile;
