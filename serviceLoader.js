// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");
const xyncl = require("xyncl");

// imports
const Logger = require("./classes/Logger.js");

const directory = "services";
const logger = new Logger("service loader", "cyan");

function readServices() {
    return new Promise((resolve, reject) => {
        const services = {};

        fs.readdir(directory, (error, files) => {
            for (const file of files) {
                const service = new (require(path.join(process.cwd(), directory, file)))();

                services[service.name] = service;
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
        const services = await readServices();
        const ranked = rankServices(Object.values(services));
        
        exports.services = services;

        for (const rank of ranked.reverse()) {
            const promises = [];

            for (const service of rank) {
                if (service.defaults) {
                    const options = {};
                    const name = service.name;
                    options[`configs/${name}.json`] = service.defaults;
                    const config = (await xyncl(options))[name];

                    promises.push(service.load(config));
                } else {
                    promises.push(service.load());
                }
            }

            await Promise.all(promises);

            logger.log("loaded ", ...rank.reduce((acc, cur) => acc.length > 0 ? [ ...acc, ", ", cur.name ] : [ cur.name ], []));
        }
    });
}

// exports
exports.load = load;
exports.services = {};