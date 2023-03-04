"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const path_1 = tslib_1.__importDefault(require("path"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const router_1 = require("./routes/router");
const mongoose_1 = require("mongoose");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_2 = require("./passport");
const passport_local_1 = require("passport-local");
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const uuid_1 = require("uuid");
require("reflect-metadata");
const debug = require('debug');
const throng = require('throng');
const FileStore = require('session-file-store')(express_session_1.default);
const compression = require('compression');
require('dotenv').config(); // Injects .env variables into process.env object
// eslint-disable-next-line import/first
debug('ts-express:server');
function onListening(id) {
    console.log(`🚀 ${process.env.NODE_ENV} worker ${id} ready, listening on port ${process.env.PORT || 4000}`);
}
const master = () => {
    try {
        ;
        (async () => {
            await (0, mongoose_1.connect)(process.env.DB_CONNECT);
        })();
    }
    catch (err) {
        console.log('Mongo ', err);
    }
    process.once('beforeExit', async () => {
        await (0, mongoose_1.disconnect)();
    });
};
const start = (id, disconnect) => {
    process.on('SIGINT', () => {
        console.log(`Worker ${id} exiting`);
        disconnect();
    });
    process.on('SIGTERM', () => {
        console.log(`Worker ${id} exiting`);
        disconnect();
    });
    process.on('exit', (code) => {
        disconnect();
    });
    process
        .on('unhandledRejection', (reason, p) => {
        // Use your own logger here
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
        .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
    });
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        credentials: true,
        origin: (origin, callback) => {
            return callback(null, true);
        }
    }));
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)(process.env.PRIVATE));
    app.use(express_1.default.urlencoded({ extended: true }));
    const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
    app.use((0, express_session_1.default)({
        secret: process.env.PRIVATE || 'test',
        resave: true,
        saveUninitialized: true,
        genid: () => {
            return (0, uuid_1.v4)();
        },
        store: new FileStore({ ttl: WEEK_IN_SECONDS })
    }));
    // test env mocks mongodb
    if (process.env.NODE_ENV !== 'test') {
        ;
        (async () => await (0, mongoose_1.connect)(process.env.DB_CONNECT))();
    }
    app.use(compression());
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, passport_2.passportStrategy));
    passport_1.default.serializeUser(passport_2.serializeUser);
    passport_1.default.deserializeUser(passport_2.deserializeUser);
    app.use(router_1.router);
    const serveClient = () => {
        const redirectionFilter = (req, res, next) => {
            if (req.get('X-Forwarded-Proto') === 'http') {
                const redirectTo = `https://${req.hostname}${req.url}`;
                res.redirect(301, redirectTo);
            }
            else {
                next();
            }
        };
        app.get('/*', redirectionFilter);
        app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../client/build')));
        app.get('/*', function (req, res) {
            res.sendFile(path_1.default.resolve(__dirname, '../../client/build', 'index.html'));
        });
    };
    if (process.env.NODE_ENV === 'production') {
        serveClient();
    }
    app.use((err, req, res, next) => {
        console.error('Error: ', err.message);
        res.status(err.statusCode || 500).json({ error: err.message });
    });
    app.listen(process.env.PORT || 4000, () => onListening(id));
};
var WORKERS = process.env.WEB_CONCURRENCY || 1;
throng({
    worker: start,
    master: master,
    lifeTime: Infinity,
    count: WORKERS,
    signals: ['SIGTERM', 'SIGINT']
});
//# sourceMappingURL=index.js.map