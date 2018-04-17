// community modules
const Promise = require("promise");
const axios = require("axios");
const cheerio = require("cheerio");

// imports
const APICaller = require("../classes/APICaller.js");
const Logger = require("../classes/Logger.js");

class Rule34Caller extends APICaller {

    constructor() {
        super("rule34Caller");

        this.defaults = {
            ...this.defaults,
            cache: 60000
        };
        this._logger = new Logger("rule34", "green");
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

            axios.get(`http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tags}`)
                .then((response) => {
                    try {
                        const $ = cheerio.load(response.data);
                        const posts = $("post");

                        this._cache[tags] = {
                            data: posts,
                            time: Date.now()
                        };

                        resolve(posts);
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
module.exports = Rule34Caller;