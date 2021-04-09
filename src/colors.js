const ini = require('iniparser');
const lodash = require('lodash');
const fs = require('fs');
const config = require('./config').colors;

let lastReadConfig = {};

const readColorConfig = () => {
    let result = null;
    try {
        result = ini.parseSync(config.iniFilePath);

    }
    catch {
        console.log('Color configuration could not be read, falling back default values');
        return config.fallbackValues;
    }
    if (!lastReadConfig) { // if the last config is not yet set, set it for the first times
        lastReadConfig = result.Night;
    }
    return result.Night;
};

const watchForConfigChanges = (callback) => {
    fs.watchFile(config.iniFilePath, {
        persistent: true,
        interval: config.watchingInterval
    }, (curr, _) => {
        console.log(`Detected config change at ${curr}.`);
        if (lodash.isEqual(readColorConfig(), lastReadConfig)) {
            callback();
        }

    });
}
module.exports.watchForConfigChanges = watchForConfigChanges;
module.exports.readColorConfig = readColorConfig;