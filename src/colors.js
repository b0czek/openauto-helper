const ini = require('ini');
const fs = require('fs');

const readColorConfig = () => {
    fs.readFile('/home/pi/.openauto/config/openauto_system.ini', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        let config = ini.parse(data.toString('utf-8'));
        console.log(config);
    });
};

module.exports.readColorConfig = readColorConfig;