# Mantella

Mantella is a fully-fledged project management website. Feel free to visit the website and sign in as a guest to explore what it has to offer.

## Quickstart

To run the site locally, download the repository and in the terminal:

`> npm i`
`> cd client`
`> npm start`
(in a separate terminal)
`> cd server`
Linux: `> touch .env`
Windows: `> New-Item .env`
(write in the file)
PORT=any port number such as 4000
DB_CONNECT=a connection string to a mongo database, .env files do not require quotes
PRIVATE=a string that will be used as a secret for cookies/sessions
`> npm run dev`

### Server

The API structure can be found in /server/routes/types.ts where every routes request and response data is detailed

We are using `Node.js` to run server-side javascript with `Express` as the RESTful framework, `Mongoose` to access the Mongo database, and `Passport` to handle authentication. Websockets will soon be implemented, but for now the server is mostly CRUD.

### Client

The client is running on `React.js` which means that our UI is divided into components, and state update is automatically reflected in the DOM. State can be local in the component, or in the `Redux` store which can be thought of as a god object. `Material-ui` is used as a UI framework and although large, is very extensive and presents without much effort. Drag and drop is implemented by `dnd-kit` and is the one of the more complex parts of the client.

## Direction

Instead of subtasks, everything will be it's own task, and prerequisites will be a fundemental feature, wired together.

## Todos

Allow link as [http://mantella.herokuapp.com?action=autoTrial] which would automatically create a guest account which has all premium features for 7 days. Migration of guest accounts to proper account should be added after this is added (settings -> set email/password)

Websocket for every update
Look into operational transformation
Edit history from diffs

Search bar smooth scroll to task

Notetaker

Wire components together

Animations with react-spring, dark to light mode is jarring for example

"List view" that actually shows lists, separate from "tasks"

dragging user doesn't show, as if z-index is too low

See how feasable mobile (probably sideways orientation) would be

Chat:
Message with specific user, even groups

Settings:
Persistent default theme

Project members:
privileges for certain members, transfer to owner

Statistics:
Track who completes task and when
