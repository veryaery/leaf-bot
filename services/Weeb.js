// core modules
const path = require("path");
const fs = require("fs");

// communuity modules
const Promise = require("promise");
const xyncl = require("xyncl");
const { Command, Argument } = require("xyncp");
const imagemin = require("imagemin");
const imageminGifsicle = require("imagemin-gifsicle");

// imports
const Service = require("../classes/Service.js");
const Mention = require("../types/Mention.js");

class Weeb extends Service {

    constructor() {
        super("weeb");

        this.dependencies = [ "commands" ];
        this._directory = path.join(process.cwd(), "commands", "weeb");
        this._services = {};
    }

    async _registerCommand(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const options = {};
                options[path.join(this._directory, `${name}.json`)] = null;
                const config = (await xyncl(options))[name];
                const command = new Command(name)
                    .setArgs([
                        new Argument("object")
                        .setType(new Mention("member"))
                    ])
                    .setAliases(config.aliases)
                    .set("execute", (output, message, client) => {
                        return new Promise((resolve, reject) => {
                            const directory = path.join(this._directory, name);
                        
                            fs.readdir(directory, (error, files) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    const file = path.join(directory, files[Math.floor(Math.random() * files.length)]);
                                    const textMessage = config.messages[Math.floor(Math.random() * config.messages.length)]
                                        .split("$subject").join(message.member.displayName)
                                        .split("$object").join(output.args.object.displayName);

                                    imagemin([ file ], null, [ imageminGifsicle() ])
                                        .then((files) => {
                                            message.channel.send(textMessage, {
                                                files: [
                                                    {
                                                        attachment: files[0].data,
                                                        name: `${name}${path.extname(file)}`
                                                    }
                                                ]
                                            })
                                                .then((message) => resolve())
                                                .catch(reject);
                                        })
                                        .catch(reject);
                                }
                            });
                        });
                    });

                this._services.commands.register("weeb", command);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async _registerCommands() {
        return new Promise(async (resolve, reject) => {
            fs.readdir(this._directory, async (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    for (const file of files) {
                        if (!path.extname(file)) {
                            try {
                                await this._registerCommand(file);
                            } catch (error) {
                                return reject(error);
                            }
                        }
                    }

                    resolve();
                }
            });
        });
    }

    load(config) {
        return new Promise((resolve, reject) => {
            this._services = require("../services.js").services;

            this._registerCommands()
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Weeb;