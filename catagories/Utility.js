// imports
const Catagory = require("../classes/Catagory.js");

class Utility extends Catagory {

    constructor() {
        super("utility");

        this.description = "commands to make your discord life slightly easier";
        this.color = 0x0099ff;
        this.position = 1;
    }

}

// exports
module.exports = Utility;