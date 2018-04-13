// imports
const Catagory = require("../classes/Catagory.js");

class Utility extends Catagory {

    constructor() {
        super("essential");

        this.description = "";
        this.color = 0x00ff99;
        this.position = 0;
    }

}

// exports
module.exports = Utility;