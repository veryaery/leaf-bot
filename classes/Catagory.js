class Catagory {

    constructor(name) {
        this._name = name;
    }

    // getters, setters, and set methods
    get name() { return this._name; }
    set name(name) { this._name = name; }
    setName(name) { this._name = name; return this; }

    get description() { return this._description; }
    set description(description) { this._description = description; }
    setDescription(description) { this._description = description; return this; }

    get color() { return this._color; }
    set color(color) { this._color = color; }
    setColor(color) { this._color = color; return this; }

    get position() { return this._position; }
    set position(position) { this._position = position; }
    setPosition(position) { this._position = position; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

}

// exports
module.exports = Catagory;