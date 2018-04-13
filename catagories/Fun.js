// imports
const Catagory = require("../classes/Catagory.js");

class Fun extends Catagory {

    constructor() {
        super("fun");

        this.description = "commands to brighten up your server";
        this.color = 0xff3399;
        this.position = 2;
    }

}

// exports
module.exports = Fun;