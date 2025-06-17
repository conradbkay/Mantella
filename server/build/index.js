"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const db_1 = require("./db/db");
require("reflect-metadata");
const app_1 = require("./app");
require('dotenv').config();
const debug = require('debug');
debug('ts-express:server');
function onListening() {
    console.log(`🚀 ${process.env.NODE_ENV} worker ready, listening on port ${process.env.PORT || 4000}`);
}
process.on('exit', (code) => {
    (0, db_1.closeDatabase)();
});
process
    .on('unhandledRejection', (reason, p) => {
    // Use your own logger here
    console.error(reason, 'Unhandled Rejection at Promise', p);
})
    .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
});
const app = (0, app_1.createApp)();
exports.app = app;
app.listen(process.env.PORT || 4000, () => onListening());
//# sourceMappingURL=index.js.map