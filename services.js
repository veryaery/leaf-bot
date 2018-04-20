// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");
const xyncl = require("xyncl");
const chalk = require("chalk");

// imports
const Logger = require("./classes/Logger.js");

const directory = "services";
const logger = new Logger("services", "cyan");

let services = {};

function readServices() {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (error, files) => {
            for (const file of files) {
                const service = new (require(path.join(process.cwd(), directory, file)))();

                services[service.name] = service;
            }

            resolve();
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
        await readServices();
        const ranked = rankServices(Object.values(services));

        for (const rank of ranked.reverse()) {
            const promises = [];

            for (const service of rank) {
                let config = {};

                if (service.defaults) {
                    const options = {};
                    options[`configs/${service.name}.json`] = service.defaults;
                    config = (await xyncl(options))[service.name];
                }
                
                promises.push(service.load(config).catch((error) => {
                    logger.logRaw(chalk.red(`error in ${service.name}`));
                    console.error(error);
                }));
            }

            await Promise.all(promises);

            logger.log("loaded ", ...rank.reduce((acc, cur) => acc.length > 0 ? [ ...acc, ", ", cur.name ] : [ cur.name ], []));
        }
    });
}

// exports
exports.load = load;
exports.services = services;