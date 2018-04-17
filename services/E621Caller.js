// community modules
const Promise = require("promise");
const axios = require("axios");

// imports
const APICaller = require("../classes/APICaller.js");
const Logger = require("../classes/Logger.js");

class E621Caller extends APICaller {

    constructor() {
        super("e621Caller");

        this.defaults = {
            ...this.defaults,
            cache: 60000
        };
        this._logger = new Logger("e621", "blue");
        this._cache = {};
    }

    onQueue(call) {
        const cache = this._cache[call.tags.join("+")];

        if (cache && Date.now() - cache.time < this._config.cache) {
            return cache.data;
        } else {
            return false;
        }
    }

    onCall(call) {
        return new Promise((resolve, reject) => {
            const tags = call.tags.join("+");

            axios.get(`http://e621.net/post/index.json?tags=${tags}`)
                .then((response) => {
                    try {
                        this._cache[tags] = {
                            data: response.data,
                            time: Date.now()
                        };

                        resolve(response.data);
                    } catch (error) {
                        reject(error);
                    }
                })
                .catch(reject);
        });
    }

    load(config) {
        this._config = config;

        return super.load(config);
    }

}

// exports
module.exports = E621Caller;