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

    get dependencies() { return this._dependencies; }
    set dependencies(dependencies) { this._dependencies = dependencies; }
    setDependencies(dependencies) { this._dependencies = dependencies; return this; }

    get defaults() { return this._defaults; }
    set defaults(defaults) { this._defaults = defaults; }
    setDefaults(defaults) { this._defaults = defaults; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

    load(config) {
        return Promise.resolve();
    }

}

// exports
module.exports = Service;