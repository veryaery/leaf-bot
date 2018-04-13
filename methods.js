// core modules
const crypto = require("crypto");

function numberize(input) {
    return parseInt(crypto.createHash("sha256").update(input).digest("hex").slice(0, 10), 16);
}

// exports
exports.numberize = numberize;