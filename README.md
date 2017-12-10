# MyProgress

My progress trail is a web application developed in Angular to allow user to manage and track goals in progress trails. For now there's nothing more than unit tests validating the Trail and Goals services, which is the core of the app. 
This version, and unit tests, use an internal mock repository to storage the data on the client. This app is intended to be a standalone application on the browser. Synchronizing user data would be only available in later versions.

## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Prerequisites

* Install `Node.js` from Node.js [website](https://nodejs.org/en/).
* Install the my-progress-trail project by running `npm install`.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
