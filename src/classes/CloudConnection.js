const WebSocket = require("ws");

/**
 * A class to represent a cloud connection.
 */
class CloudConnection {
  /**
   *
   * @param {number} projectId The project to connect to
   * @param {ScratchSession} client The client of the user to change variables as
   * @param {string} cloudServer The cloud server URL. Defaults to scratch's servers
   * @param {boolean} provideAuthentication Boolean to send the client cookie
   */
  constructor(
    projectId,
    client,
    cloudServer = "wss://clouddata.scratch.mit.edu",
    provideAuthentication = true
  ) {
    this._client = client;
    this.projectId = projectId;
    let cookie = provideAuthentication
      ? `scratchsessionsid=${client.auth.session};`
      : "";
    const headers = {
      Cookie: cookie,
      origin: "https://scratch.mit.edu",
    };

    this.cookie = cookie;
    this.headers = headers;
    this.cloudServer = cloudServer;
    this._connect();
  }

  /**
   * @private
   */
  _connect() {
    this._ws = new WebSocket(this.cloudServer, {
      headers: this.headers,
    });

    this._ws.on("open", () => {
      this._send({
        method: "handshake",
        user: this._client.username,
        project_id: String(this.projectId),
      });
      setTimeout(
        () => this.setVariable(`_mjsVar${Date.now()}`, Date.now()),
        100
      );
    });

    let _this = this;

    this._ws.on("message", (e) => {
      if (!e || typeof e !== 'string') return;
      for (let message of e.split("\n")) {
        const obj = JSON.parse(message || `{"method": "err"}`);

        if (obj.method == "set") {
          _this.variables[obj.name] = obj.value;
        }
      }
    });

    this._ws.on("close", () => {
      !this.terminated && _this._connect();
    });

    this._ws.on("error", (err) => {
      throw new Error("Unexpected error in cloud");
    });
  }

  /**
   * Sends a packet to the server.
   * @param {object} data
   * @private
   */
  _send(data) {
    this._ws.send(`${JSON.stringify(data)}\n`);
  }

  /**
   * Gets a variable
   * @param {string} variable
   */
  getVariable(variable) {
    return this.variables["☁ " + variable];
  }

  /**
   * Sets a variable
   * @param {string} variable
   * @param {number} value
   */
  setVariable(variable, value) {
    this.variables["☁ " + variable] = value;
    this._send({
      user: this._client.username,
      method: "set",
      name: `☁ ${variable}`,
      value: String(value),
      project_id: this.projectId,
    });
  }
  variables = {};
  terminate() {
    this.terminated = true;
    this._ws.close(1);
  }
}

module.exports = CloudConnection;
