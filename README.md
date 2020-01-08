# Watch+Strap Tizen App

This is a tizen wearable app for the Samsung Gear S3.
The app connects to a given websocket server, renders recieved image data onto a canvas, and forwards inputs to the server.

## Usage
Import the project in Tizen Studio.
Before compiling, add a `js/config.js` file defining the server address:
```
const server = "http://yourserver.com:12345";
```
Alternatively, you can also hard-code the address in the `js/main.js` file (`const socket = io('http://yourserver.com:12345');`).