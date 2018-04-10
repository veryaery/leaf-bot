// imports
const Service = require("../classes/Service.js");

class Bot extends Service {

    constructor() {
        super("bot");

        this.dependencies = [ "commandLoader" ];
        this.defaults = {
            token: ""
        };
    }

    load(config) {
        console.log("bot");
    }

}

// exports
module.exports = Bot;