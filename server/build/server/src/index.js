"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const http = tslib_1.__importStar(require("http"));
const nodemon = require('nodemon');
const server_1 = tslib_1.__importDefault(require("./server"));
require("reflect-metadata");
debug_1.default('ts-express:server');
/* set port */
function purifyProjectPort(val) {
    return typeof val === 'string' ? parseInt(val, 10) : val;
}
const port = purifyProjectPort(process.env.PORT || 4000);
server_1.default.set('port', port);
server_1.default.use((err, req, res, next) => {
    console.error('Throwing an Error: ', err.message); // Log error message in our server's console
    res.status(err.statusCode || 500).json({ error: err.message });
});
/* create server */
const server = http.createServer(server_1.default);
server.listen(port, onListening);
server.on('error', onError);
process.on('SIGINT', () => {
    console.log('Bye bye!');
    process.exit();
});
process.on('exit', (code) => {
    nodemon.emit('quit');
    process.exit(code);
});
function onListening() {
    const addr = server.address();
    console.log(`🚀  Server ready, listening on port ${typeof addr === 'string' && addr !== null ? addr : addr.port.toString()}`);
}
/** error handling :) */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`BEEP BOOP: ${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`BEEP BOOP: ${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
//# sourceMappingURL=index.js.map