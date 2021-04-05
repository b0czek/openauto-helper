const mcp3424 = require('./mcp3424');
let address = 0x6C;
let resolution = 1;
let gain = 0;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public' + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});





let mcp = new mcp3424(address, gain, resolution, '/dev/i2c-1');

setInterval(_ => {
    let voltage = mcp.getVoltage(0);
    io.emit('voltage', voltage > 5 ? 5.00 : voltage);
    //console.log(Math.round(mcp.getVoltage(0) * 100) / 100 + "v");
}, 20);
