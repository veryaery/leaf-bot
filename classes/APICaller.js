// community modules
const Promise = require("promise");

// imports
const Service = require("./Service.js");

class APICaller extends Service {

    constructor(name) {
        super(name);

        this.defaults = {
            interval: 5000
        };
        this._queue = [];
        this._instant = false;
    }

    onCall() {}
    onQueue() {}

    queue(call) {
        return new Promise((resolve, reject) => {
            const result = this.onQueue(call);

            if (result) {
                resolve({
                    position: 0,
                    result: Promise.resolve(result)
                });
            } else { 
                if (this._instant) {
                    this._instant = false;

                    resolve({
                        position: 0,
                        result: this.onCall(call)
                    });
                } else {
                    resolve({
                        position: this._queue.length + 1,
                        result: new Promise((resolve, reject) => {
                            this._queue.push({
                                call,
                                resolve,
                                reject
                            });
                        })
                    })
                }
            }
        });
    }

    load(config) {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (this._queue.length > 0) {
                    const call = this._queue.pop();
                    
                    this.onCall(call.call)
                        .then(call.resolve)
                        .catch(call.reject);
                } else {
                    this._instant = true;
                }
            }, config.interval);

            resolve();
        });
    }

}

// exports
module.exports = APICaller;