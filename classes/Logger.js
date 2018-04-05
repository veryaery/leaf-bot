// community imports
const chalk = require("chalk");

class Logger {

    constructor(name, color) {
        this._name = name;
        this._color = color;
    }

    log() {
        let highlight = false;
        let message = "";

        for (const key in arguments) {
            const arg = arguments[key];

            if (highlight) {
                highlight = false;
                message += Logger.highlight(arg);
            } else {
                highlight = true;
                message += Logger.normal(arg);
            }
        }

        console.log(chalk[this._color](`[${this._name}]`), message);
    }

}

Logger.normal = chalk.gray;
Logger.highlight = chalk.white;

// exports
module.exports = Logger;