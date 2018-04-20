// core modules
const url = require("url");
const path = require("path");

// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");
const Discord = require("discord.js");

// imports
const { redditCaller } = require("../../services.js").services;

class Reddit extends Command {

    constructor() {
        super("reddit");

        this.args = [
            new Argument("subreddit")
                .setType(new types.Str())
                .setOptional(true)
        ];
        this._formats = [
            "png",
            "gif",
            "jpg",
            "jpeg"
        ];
    }

    _extname(postURL) {
        const extname = path.extname(url.parse(postURL).pathname);
        return extname.slice(1, extname.length);
    }

    async execute(output, message, client) {
        return new Promise((resolve, reject) => {
            redditCaller.queue({
                subreddit: output.args.subreddit || "all"
            }).then(async (call) => {
                let queueMessage = null;
    
                if (call.position > 0) {
                    queueMessage = await message.channel.send(`⌛ position in request queue: \`${call.position}\``);
                }
    
                call.result.then(async (data) => {
                    const available = data.data.children.filter((post) => {
                        if (!this._formats.includes(this._extname(post.data.url))) {
                            return false;
                        } else if (post.data.pinned) {
                            return false;
                        } else if (post.data.over_18 && !message.channel.nsfw) {
                            return false;
                        } else {
                            return true;
                        }
                    });
    
                    if (available.length > 0) {
                        const post = available[Math.floor(Math.random() * available.length)].data;
        
                        await message.channel.send({
                            files: [
                                {
                                    attachment: post.url,
                                    name: `${post.subreddit}.${this._extname(post.url)}`
                                }
                            ],
                            embed: new Discord.RichEmbed()
                                .setTitle(post.title)
                                .setURL(`https://reddit.com${post.permalink}`)
                                .setAuthor(post.author)
                                .setColor(0xff5700)
                        })
                            .then((message) => resolve())
                            .catch(reject);
                    } else {
                        await message.channel.send("no appropriate posts found")
                            .then((message) => resolve())
                            .catch(reject);
                    }
    
                    if (queueMessage) {
                        queueMessage.delete();
                    }
                }).catch(reject);
            });
        });
    }

}

// exports
module.exports = Reddit;