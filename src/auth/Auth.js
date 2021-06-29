class Auth {
  constructor() {}
  get cookie() {
    return `scratchlanguage=en;scratchcsrftoken=${this.csrfToken};scratchsessionsid=${this.session};permissions=${this.permissions}`;
  }
}

module.exports = Auth;
