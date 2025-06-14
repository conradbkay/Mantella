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
const nanoid_1 = require("nanoid");
require("reflect-metadata");
const https_1 = tslib_1.__importDefault(require("https"));
const Chat_1 = require("./models/Chat");
const debug = require('debug');
const FileStore = require('session-file-store')(express_session_1.default);
const compression = require('compression');
const { Server } = require('socket.io');
require('dotenv').config();
debug('ts-express:server');
function onListening() {
    console.log(`🚀 ${process.env.NODE_ENV} worker ready, listening on port ${process.env.PORT || 4000}`);
}
process.on('exit', (code) => {
    (0, mongoose_1.disconnect)();
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
const websocketServer = https_1.default.createServer();
const io = new Server(websocketServer);
io.on('connection', (socket) => {
    socket.on('send_message', async ({ chatId, message, userId, id }) => {
        const messageObj = {
            message,
            senderId: userId,
            createdAt: new Date().getTime(),
            id: id || (0, nanoid_1.nanoid)()
        };
        io.in(chatId).emit('message', messageObj);
        const chat = await Chat_1.ChatModel.findOne({ id: chatId });
        if (chat) {
            chat.messages.push(messageObj);
            await chat.save();
        }
    });
    socket.on('login', ({ chatIds }) => {
        for (let chatId of chatIds) {
            socket.join(chatId);
        }
    });
    socket.on('join', (room) => {
        socket.join(room);
    });
});
const websocketPort = process.env.WEBSOCKET_PORT || 3000;
// ! todo set vite proxy up and pick a unique port for this too
if (process.env.NODE_ENV !== 'production') {
    websocketServer.listen(websocketPort, () => {
        console.log(`websocket listening on port ${websocketPort}`);
    });
}
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.PRIVATE));
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // heroku, maybe not still needed?
}
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
app.use((0, express_session_1.default)({
    secret: process.env.PRIVATE || 'test',
    resave: false,
    saveUninitialized: false,
    genid: () => {
        return (0, nanoid_1.nanoid)();
    },
    name: 'Mantella',
    cookie: {
        sameSite: 'lax',
        secure: 'auto',
        httpOnly: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: new FileStore({ ttl: WEEK_IN_SECONDS })
}));
app.use((0, express_session_1.default)({
    secret: process.env.PRIVATE || 'test',
    resave: false,
    proxy: process.env.NODE_ENV == 'production' ? true : false, // required for heroku
    saveUninitialized: false,
    name: 'mantella',
    cookie: process.env.NODE_ENV == 'production'
        ? {
            sameSite: 'none',
            secure: true,
            domain: 'conradkay.com',
            httpOnly: true
        }
        : undefined,
    genid: () => {
        return (0, nanoid_1.nanoid)();
    },
    store: new FileStore({ ttl: WEEK_IN_SECONDS })
}));
// test env mocks mongodb
if (process.env.NODE_ENV !== 'test') {
    ;
    (async () => {
        (0, mongoose_1.set)('strictQuery', true);
        await (0, mongoose_1.connect)(process.env.DB_CONNECT);
        console.log('MongoDB connected');
    })();
}
app.use(compression());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email', passReqToCallback: true }, passport_2.passportStrategy));
passport_1.default.serializeUser(passport_2.serializeUser);
passport_1.default.deserializeUser(passport_2.deserializeUser);
app.use('/api/', router_1.router);
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
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../dist')));
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, '../dist/index.html'));
});
app.use((err, req, res, next) => {
    console.error('Error: ', err);
    res.status(err.statusCode || 500).json({ error: err.message });
});
app.listen(process.env.PORT || 4000, () => onListening());
//# sourceMappingURL=index.js.map