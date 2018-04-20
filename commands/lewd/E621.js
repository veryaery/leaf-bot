// core modules
const url = require("url");
const path = require("path");

// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");
const Discord = require("discord.js");

// imports
const { e621Caller } = require("../../services.js").services;

class E621 extends Command {

    constructor() {
        super("e621");

        this.args = [
            new Argument("tags")
                .setType(new types.List(new types.Str()))
        ];
        this.nsfw = true;
    }

    async execute(output, message, client) {
        return new Promise((resolve, reject) => {
            e621Caller.queue({
                tags: output.args.tags
            }).then(async (call) => {
                let queueMessage = null;
    
                if (call.position > 0) {
                    queueMessage = await message.channel.send(`⌛ position in request queue: \`${call.position}\``);
                }
    
                call.result.then(async (data) => {
                    const post = data[Math.floor(Math.random() * data.length)];

                    await message.channel.send({
                        files: [
                            {
                                attachment: post.file_url,
                                name: `e621${path.extname(url.parse(post.file_url).pathname)}`
                            }
                        ]
                    })
                        .then((message) => resolve())
                        .catch(reject);

                    if (queueMessage) {
                        queueMessage.delete();
                    }
                });
            }).catch(reject);
        });
    }

}

// exports
module.exports = E621;