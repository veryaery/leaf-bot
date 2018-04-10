// imports
const Service = require("../classes/Service.js");

class CommandLoader extends Service {

    constructor() {
        super("commandLoader");
    }

    load(config) {
        console.log("commandLoader");
    }

}

// exports
module.exports = CommandLoader;