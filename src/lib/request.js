const fetch = require("node-fetch");

/**
 * Fetches the given URL using node-fetch
 * @param {string} url
 * @param {object} opts
 * @returns {Promise}
 */
module.exports = (url, opts) => {
  const headers = {
    "x-csrftoken": "a", // TODO: Remove this. Recent tests show that the ST removed this
    "x-requested-with": "XMLHttpRequest",
    Cookie: "permissions=%7B%7D;scratchlanguage=en;",
    referer: "https://scratch.mit.edu/",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59",
    origin: "https://scratch.mit.edu",
  };

  if (opts && opts.client) {
    headers.Cookie = opts.client.auth.cookie;
    headers["x-csrftoken"] = opts.client.auth.csrfToken || "a";
    headers["X-Token"] = opts.client.auth.xToken;
  }

  if (opts && opts.headers) {
    for (let j in opts.headers) {
      headers[j] = opts.headers[j];
    }
  }
  if (opts && typeof opts.body == "object") {
    opts.body = JSON.stringify(opts.body);
    headers["content-type"] = "application/json";
  }

  if (opts) {
    opts.headers = headers;
  }

  return fetch(url, opts);
};
