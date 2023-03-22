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

The client is running on `React.js` which means that our UI is divided into components, and state update is automatically reflected in the DOM. State can be local in the component, or in the `Redux` store which can be thought of as a god object. `Material-ui` is used as a UI framework and although large is very extensive and presents without much effort. Drag and drop is implemented by `dnd-kit` and is the one of the more complex parts of the client.

## Direction

Instead of subtasks, everything will be it's own task, and prerequisites will be a fundemental feature, wired together.

## Todos

Instead of saying "Jan 1 1:50" say "Today at 1:50" or "Due in 30 minutes"

Allow link as [http://mantella.herokuapp.com?action=autoTrial] which would automatically create a guest account which has all premium features for 7 days. Migration of guest accounts to proper account should be added after this is added (settings -> set email/password)

Edit history from git style diffs

Remove people from projects is not functional

Search bar smooth scroll to task

Chat with specific user, even groups

Changing task list to other project doesn't work

View modes in project header (calendar, list, table, global, task)
Task has sortability

Timeline view, slider due dates or drag and drop along timeline

Separate projects into iterations

SSR

make register redirect not weird, simulate login

double task border

Notetaker

deleting task makes snackbar show undo button with circular timer

Merge project header into actual header?

Wire components together

More nice animations with react-spring, dark to light mode is jarring for example
