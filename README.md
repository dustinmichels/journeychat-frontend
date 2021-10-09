# frontend

Front end for JourneyChat, built with Vue & Nuxt, as well as [SocketIO](https://socket.io/) for real-time communication and [bulma](https://bulma.io/) for style.

- Authentication flow based on [article](https://www.digitalocean.com/community/tutorials/implementing-authentication-in-nuxtjs-app).

The most import file is `pages/index.vue`. You should be able to start there and work your way out!

## Build Setup

Requires node 14!

```bash
nvm use 14
```

Run:

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Features

You should be able to:

- Sign-in, register, sign-out
- Send & receive messages in real-time to any public or private room you are part of
- Browse/ join additional public rooms
- Invite/ be-invited-to any private room
- Exit a room
- Create a new public/private room
- View chat history and members for a given room

## Design

There are pages to login/register under `pages/login.vue` and `pages/register.vue` The nuxt/auth plugin helps facilitate login with the backend using JWT. Once signed in, future calls to the API using axios will include an authentication token. If we are not signed in, middleware will redirect us from home page to login page.

Once authenticated, main chat app is loaded from `pages/index.vue`. On initial loading, the page will:

- fetch joined chat rooms from API
- open a web socket connection to the backend, using sockets IO

As you navigate to different chat rooms, the app will use the backend API to load initial data (members & messages) but once data has been loaded once it relies on socketsIO for real-time communication.

## Limitations / Next steps

- I tried to keep `pages/index.vue` fairly tidy and move some logic elsewhere, but it is still fairly complex. Could make better use of components, and probably move some of the core information retrieval & management stuff () into Vuex global state.

- The objects that the backend api sends/receives are fairly clear and well documented. The SocketIO communication and internal data management really on more tenuous data types. Could be improved with TypeScript or perhaps gRPC.
