// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");
const xyncl = require("xyncl");

// imports
const Logger = require("./classes/Logger.js");

const directory = "services";
const logger = new Logger("services", "cyan");
let services = [];

function readServices() {
    return new Promise((resolve, reject) => {
        const services = [];
        fs.readdir(directory, (error, files) => {
            for (const key of files) {
                const service = require(path.join(__dirname, directory, key));

                services.push(new service());
            }

            resolve(services);
        });
    });
}

function rankServices(services) {
    const ranked = [];
    const available = [ ...services ];

    while (available.length > 0) {
        const dependencies = [];
        const rank = [];

        for (const service of available) {
            if (service.dependencies) {
                for (const dependency of service.dependencies) {
                    if (!dependencies.includes(dependency)) {
                        dependencies.push(dependency);
                    }
                }
            }
        }

        for (const service of [ ...available ]) {
            if (!dependencies.includes(service.name)) {
                available.splice(available.indexOf(service), 1);
                rank.push(service);
            }
        }

        ranked.push(rank);
    }

    return ranked;
}

async function load() {
    return new Promise(async (resolve, reject) => {
        services = await readServices();
        const ranked = rankServices(services);

        for (const rank of ranked.reverse()) {
            const promises = [];

            logger.log("loading ", ...rank.reduce((acc, cur) => acc.length > 0 ? [ ...acc, ", ", cur.name ] : [ cur.name ], []));

            for (const service of rank) {
                if (service.defaults) {
                    const options = {};
                    options[`configs/${service.name}.json`] = service.defaults;
                    const config = xyncl(options);

                    promises.push(service.load(config));
                } else {
                    promises.push(service.load());
                }
            }

            await Promise.all(promises);
        }
    });
}

// exports
exports.load = load;
exports.services = services;