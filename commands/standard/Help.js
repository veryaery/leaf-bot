// community modules
const { Command, Option } = require("xyncp");
const Discord = require("discord.js");

// imports
const { commands } = require("../../services.js").services;

class Ping extends Command {

    constructor() {
        super("help");

        this.options = {
            "--": [
                new Option("here")
            ]
        }
        this.aliases = [ "commands" ];
        this._step = 0.12;
        this._saturation = 1;
        this._lightness = 0.75;
    }

    // originally by github/mjackson
    _hueToRGB(p, q, t) {
        if (t < 0) {
            t += 1;
        } else if (t > 1) {
            t -= 1;
        }

        if (t < 1/6) {
            return p + (q - p) * 6 * t;
        } else if (t < 1/2) {
            return q;
        } else if (t < 2/3) {
            return p + (q - p) * (2/3 - t) * 6;
        } else {
            return p;
        }
    }

    // originally by github/mjackson
    _HSLToRGB(h, s, l) {
        let r = null;
        let g = null;
        let b = null;
        
        if (s == 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
        
            r = this._hueToRGB(p, q, h + 1 / 3);
            g = this._hueToRGB(p, q, h);
            b = this._hueToRGB(p, q, h - 1 / 3);
        }
        
        return [ r * 255, g * 255, b * 255 ];
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

                output.push(`[${optionOutput}]`);
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
        const channel = output.options.here ? message.channel : message.author;

        await channel.send({
            embed: new Discord.RichEmbed()
                .setTitle("leaf")
                .setDescription("hi~!\n\ni'm leaf, a private discord bot developed by xynfa\n\nyou can view my source code at my [github repository](https://github.com/xynfa/leaf-bot)")
                .setFooter("(required) [optional]")
                .setThumbnail(client.user.displayAvatarURL)
                .setColor(0x00ff99)
        });

        let hue = Math.random();

        for (const catagory of Object.values(commands.catagories).sort((x, y) => x.position - y.position)) {
            hue = (hue + this._step) % 1;
            const color = this._HSLToRGB(hue, this._saturation, this._lightness).map((x) => Math.floor(x).toString(16).padStart(2, "0"));

            await channel.send({
                embed: new Discord.RichEmbed()
                    .setTitle(catagory.name)
                    .setDescription(`${catagory.description}\n\n${this._stringify(catagory.commands).join("\n")}`)
                    .setColor(`#${color[0]}${color[1]}${color[2]}`)
            });
        }

        if (!output.options.here) {
            message.channel.send("📬 help sent to your dms");
        }
    }

}

// exports
module.exports = Ping;