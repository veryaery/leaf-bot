// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");

// imports
const Logger = require("./classes/Logger.js");

const directory = "services";
const logger = new Logger("services", "cyan");
let services = [];

function readServices() {
    return new Promise((resolve, reject) => {
        logger.log("reading services");

        fs.readdir(directory, (error, files) => {
            for (const key of files) {
                const name = path.basename(key, path.extname(key));

                logger.log("reading ", name);

                const service = require(path.join(__dirname, directory, key));

                services.push(new service());
            }
        });
    });
}

async function load() {
    return new Promise(async (resolve, reject) => {
        await readServices();

        for (const service of services) {

        }
    });
}

// exports
exports.load = load;
exports.services = services;