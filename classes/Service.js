// community modules
const Promise = require("promise");

class Service {

    constructor(name) {
        this._name = name;
    }

    // getters, setters, and set methods
    get name() { return this._name; }
    set name(name) { this._name = name; }
    setName(name) { this._name = name; return this; }

    get dependencies() { return this.dependencies; }
    set dependencies(dependencies) { this._dependencies = dependencies; }
    setDependencies(dependencies) { this._dependencies = dependencies; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

    load() {
        return Promise.resolve();
    }

}

// exports
module.exports = Service;