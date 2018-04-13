// imports
const Catagory = require("../classes/Catagory.js");

class Fun extends Catagory {

    constructor() {
        super("fun");

        this.description = "commands to brighten up your server";
        this.position = 2;
    }

    get color() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

}

// exports
module.exports = Fun;