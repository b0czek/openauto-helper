const mcp3424 = require('./mcp3424');
const config = require('./config').mcp3424;

let mcp = new mcp3424(config.address, config.gain, config.resolution, config.bus);
let lastVoltage = null;

const start = callback => {
    setInterval(_ => {
        let voltage = Math.round((mcp.getVoltage(0) + Number.EPSILON) * 100) / 100;
        if (voltage != lastVoltage) {
            lastVoltage = voltage;
            callback(voltage);
        }
    }, config.readingInterval);
}
const getVoltage = () => lastVoltage;

module.exports.start = start;
module.exports.getVoltage = getVoltage;