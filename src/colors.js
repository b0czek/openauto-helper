const ini = require('iniparser');

const readColorConfig = () => {
    ini.parse('/home/pi/.openauto/config/openauto_system.ini', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(data);
    });
};

module.exports.readColorConfig = readColorConfig;