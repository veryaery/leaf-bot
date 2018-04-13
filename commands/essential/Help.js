// community modules
const { Command } = require("xyncp");
const Discord = require("discord.js");

// imports
const Bot = require("../../services/Bot.js");
const CommandLoader = require("../../services/CommandLoader.js");

class Ping extends Command {

    constructor() {
        super("help");

        this.aliases = [ "commands" ];
    }

    _stringifyArgs(args) {
        const output = [];

        for (const arg of args) {
            const argOutput = `${arg.name}: ${arg.type.toString()}`;

            output.push(arg.optional ? `[${argOutput}]` : `(${argOutput})`);
        }

        return output;
    }

    _stringifyOptions(options) {
        let output = [];

        for (const prefix in options) {
            for (const option of options[prefix]) {
                let optionOutput = prefix + option.name;

                if (option.args) {
                    optionOutput += ` ${this._stringifyArgs(option.args).join(" ")}`;
                }

                output.push(optionOutput);
            }
        }

        return output;
    }

    _stringify(commands) {
        let output = [];

        for (const prefix in commands) {
            for (const command of commands[prefix]) {
                let commandOutput = prefix + command.name;

                if (command.args) {
                    commandOutput += ` ${this._stringifyArgs(command.args).join(" ")}`;
                }
                if (command.options) {
                    commandOutput += ` ${this._stringifyOptions(command.options).join(" ")}`;
                }

                output.push(commandOutput);

                if (command.commands) {
                    output = output.concat(this._stringify(command.commands).map((commandString) => `${prefix}${command.name} ${commandString}`));
                }
            }
        }

        return output;
    }

    async execute(output, message, client) {
        await message.channel.send({
            embed: new Discord.RichEmbed()
                .setTitle("🍃")
                .setDescription(" hi~!\ni'm leaf, a private discord bot developed by xynfa\n\nyou can view my source code in my [github repository](https://github.com/xynfa/leaf-bot)")
                .setThumbnail(Bot.client.user.displayAvatarURL)
                .setColor(0x00ff99)
        });

        for (const catagory of CommandLoader.catagories.sort((x, y) => x.position - y.position)) {
            await message.channel.send({
                embed: new Discord.RichEmbed()
                    .setTitle(catagory.name)
                    .setDescription(`${catagory.description}\n\n${this._stringify(CommandLoader.catagorizedCommands[catagory.name]).join("\n")}`)
                    .setFooter("(required) [optional]")
                    .setColor(catagory.color)
            });
        }
    }

}

// exports
module.exports = Ping;