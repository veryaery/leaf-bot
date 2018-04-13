// community modules
const { Type, Fault, methods } = require("xyncp");
const Promise = require("promise");

class Mention extends Type {

    constructor(type, options) {
        // defaults
        if (options) {
            for (const key in Mention.defaults) {
                if (!options[key]) {
                    options[key] = Mention.defaults[key];
                }
            }
        } else {
            options = Mention.defaults;
        }

        super(options);

        this._type = type;
    }

    _merge() {
        const output = {};

        for (const type in this._options.startSeparators) {
            for (const separator of this._options.startSeparators[type]) {
                output[separator] = type;
            }
        }

        return output;
    }

    _parse(separators, input) {
        const startMatches = this._merge();
        const result = methods.objectScan(input, startMatches);
        let output = "";

        if (result) {
            input = input.slice(result.key.length, input.length);

            for (const char of input.split("")) {
                const result = methods.arrayScan(input, this._options.endSeparators, this._options.caseSensitive);

                if (result) {
                    input = input.slice(result.length, input.length);

                    return {
                        input: input,
                        output: output
                    };
                } else {
                    input = input.slice(1, input.length);

                    output += char;
                }
            }
        }

        return { error: new Fault("NOT_A_MENTION", "input was not a mention", { input: input }) };
    }

    async parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            const result = this._parse(separators, input);

            if (result.error) {
                resolve(result);
            } else {
                const id = result.output;
                let output = null;
    
                switch (this._type) {
                    case "member":
                        try {
                            output = await custom.message.guild.fetchMember(id);
                        } catch (error) {}
                        break;
                }
    
                if (!output) {
                    return resolve({
                        error: new Fault("NOT_FOUND", `no ${this._type} with id ${id} was found`, {
                            input: input,
                            type: this._type,
                            id: id
                        })
                    });
                }
    
                resolve({
                    input: result.input,
                    output: output
                });
            }
        });
    }

    toString() {
        return `mention<${this._type}>`;
    }

}

// defaults
Mention.defaults = {
    startSeparators: {
        member: [
            "<@", "<@!"
        ]
    },
    endSeparators: [ ">" ]
};

// exports
module.exports = Mention;