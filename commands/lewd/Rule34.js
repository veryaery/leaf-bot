// core modules
const url = require("url");
const path = require("path");

// community modules
const { Command, Argument, types } = require("xyncp");
const Discord = require("discord.js");

// imports
const { rule34Caller } = require("../../services.js").services;

class Rule34 extends Command {

    constructor() {
        super("rule34");

        this.args = [
            new Argument("tags")
                .setType(new types.List(new types.Str()))
        ];
        this.aliases = [ "r34" ];
    }

    async execute(output, message, client) {
        if (message.channel.nsfw) {
            rule34Caller.queue({
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
                                attachment: post.attribs.file_url,
                                name: `rule34${path.extname(url.parse(post.attribs.file_url).pathname)}`
                            }
                        ]
                    })

                    if (queueMessage) {
                        queueMessage.delete();
                    }
                });
            });
        } else {
            message.channel.send("this channel is not nsfw");
        }
    }

}

// exports
module.exports = Rule34;