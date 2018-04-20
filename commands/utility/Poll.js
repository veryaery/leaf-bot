// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");

class Poll extends Command {

    constructor() {
        super("poll");

        this.args = [
            new Argument("title")
                .setType(new types.Str()),
            new Argument("options")
                .setType(new types.List(new types.Str(), {
                    min: 2,
                    max: 9
                }))
        ];
        this._emojis = {
            1: ":one:", 2: ":two:", 3: ":three:",
            4: ":four:", 5: ":five:", 6: ":six:",
            7: ":seven:", 8: ":eight:", 9: ":nine:",
        };
    }

    async execute(output, message, client) {
        return new Promise((resolve, reject) => {
            const options = [];
    
            for (let i = 0; i < output.args.options.length; i++) {
                const option = output.args.options[i];
                const emoji = this._emojis[i + 1];
    
                options.push(`${emoji} ${option}`);
            }
    
            message.channel.send(`${output.args.title}\n\n${options.join("\n")}`)
                .then(async (message) => {
                    for (let i = 0; i < output.args.options.length; i++) {
                        await message.react(`${i + 1}%E2%83%A3`);
                    }

                    resolve();
                })
                .catch(reject);
        });
    }

}

// exports
module.exports = Poll;