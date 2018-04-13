// imports
const Catagory = require("../classes/Catagory.js");

class Utility extends Catagory {

    constructor() {
        super("utility");

        this.description = "commands that make your everyday discord life slightly easier";
        this.color = 0x33cc33;
        this.position = 1;
    }

}

// exports
module.exports = Utility;