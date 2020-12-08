const { exception } = require('console');
// const path = require('path');  
const fs = require("fs");

const base64 = (data) => {
    return "data:application/octet-stream;base64," + data.toString("base64");
};

module.exports = {
    process: (src, filename, config, options) => {
        const data = base64(fs.readFileSync(filename));
        return `module.exports = ${JSON.stringify(data)};`;
    }
}
