// community modules
const Promise = require("promise");
const axios = require("axios");

// imports
const APICaller = require("../classes/APICaller.js");
const Logger = require("../classes/Logger.js");

class RedditCaller extends APICaller {

    constructor() {
        super("redditCaller");

        this.defaults = {
            interval: 5000,
            cache: 60000
        };
        this._logger = new Logger("reddit", "red");
        this._cache = {};
    }

    onQueue(call) {
        const cache = this._cache[call.subreddit];

        if (cache && Date.now() - cache.time < this._config.cache) {
            return cache.data;
        } else {
            return false;
        }
    }

    onCall(call) {
        return new Promise((resolve, reject) => {
            axios.get(`http://reddit.com/r/${call.subreddit}.json`)
                .then((response) => {
                    this._cache[call.subreddit] = {
                        data: response.data,
                        time: Date.now()
                    };

                    resolve(response.data);
                })
                .catch(reject);
        });
    }

    load(config) {
        this._config = config;

        super.load(config);
    }

}

// exports
module.exports = RedditCaller;