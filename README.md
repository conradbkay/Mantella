# Mantella

Mantella is a fully-fledged project management website. Feel free to visit the website and sign in as a guest to explore what it has to offer.

![Demo](/demo.png)

## Quickstart

To run the site locally, download the repository and in the terminal:

`> cd client`

`> npm i`

`> npm start`

`> cd ../server && npm i`

Make a .env file with the following contents:

PORT=any port number such as 4000

DB_CONNECT=a connection string to a mongo database, .env files do not require quotes

PRIVATE=a string that will be used as a secret for cookies/sessions

`> npm run dev`

### Server

The API structure can be found in /server/routes/types.ts where every routes request and response data is detailed

We are using `Node.js` to run server-side javascript with `Express` as the RESTful framework, `Mongoose` to access the Mongo database, and `Passport` to handle authentication. Websockets will soon be implemented, but for now the server is mostly CRUD.

### Client

The client is running on `React.js` which means that our UI is divided into components, and state update is automatically reflected in the DOM. State can be local in the component, or in the `Redux` store which is a giant immutable object. `Material-ui` is used as a UI framework and although large, is very extensive and presents without much effort. Drag and drop is implemented by `dnd-kit` and is the one of the more complex parts of the client.

## Direction

Instead of subtasks, everything will be it's own task, and prerequisites will be a fundemental feature, wired together.

## Todos

More integration with roles

Store filters for later use

change progress in task edit modal

graph in project statistics

Drag area over several tasks and have right click context apply to all of them, even have drag and drop of that task mass

### Documents

Entirely separate tab

Separate from projects but can give all project members access 

Similar to docs

Link document to task

### Edit History

Websocket for every update

Look into operational transformation

Edit history from diffs

### Mobile Styling

Sideways and normal orientation

Sidebar items full width on open

### Additional Features

Notetaker

Wiring components together

Animations

### Chat

Message with specific user, even groups

Track seen and unseen messages, show unread count on sidebar and perhaps tab name

### User

privileges for certain members, transfer to owner

### Statistics

Track who completes task and when

### Bugs

chat websocket doesn't work on heroku

dragging from task user to task with same user assigned is bugged

lists view drag and drop

### Tasks

Custom color management, add names for colors

### Recurring Tasks

when they drag to completed, it should go back to no progress when the due date passes, so do a check for that on login perhaps

### Development

Hot module reloading will cause drag and drop to cause an error
