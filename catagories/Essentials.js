// imports
const Catagory = require("../classes/Catagory.js");

class Utility extends Catagory {

    constructor() {
        super("essentials");

        this.description = "commands that are good to know";
        this.color = 0x00ff99;
        this.position = 0;
    }

}

// exports
module.exports = Utility;