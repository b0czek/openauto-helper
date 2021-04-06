const mcp3424 = require('./mcp3424');
let address = 0x6C;
let resolution = 1;
let gain = 0;

let mcp = new mcp3424(address, gain, resolution, '/dev/i2c-1');
let lastVoltage = null;

const start = callback => {
    setInterval(_ => {
        let voltage = Math.round((mcp.getVoltage(0) + Number.EPSILON) * 100) / 100;
        if (voltage != lastVoltage) {
            lastVoltage = voltage;
            callback(voltage);
        }
    }, 20);
}
const getVoltage = () => lastVoltage;

module.exports.start = start;
module.exports.getVoltage = getVoltage;