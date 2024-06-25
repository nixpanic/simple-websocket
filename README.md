# Simple WebSocket Example App

By deploying this Simple WebSocket App on a cloud platform, it becomes simple
to verify that loadbalancers or other proxies pass WebSocket streams without
difficulties.

## Usage

This Simple WebSocket example consists out of a container-image that provides a
webserver on port 8080. The webserver provides two functions:

 - frontend: an HTML page with JavaScript client opening a WebSocket
 - backend: an application server that reports details about reveived messages

### Frontend

The entry page when accessing the webserver on http://localhost:8080/ shows the
raw output of a WebSocket connection. An application level `ping` (data, not a
WebSocket keep-alive ping) is sent to the application server.

The implementation of the frontend is in `html/index.html` and `html/ws.js`.

### Backend

On http://localhost:8080/ws the WebSocket is provided. Upon receiving a new
connection, the application server responds with a welcome message. After that,
it just reports how many bytes were received on a message that the client sent.

The implementation of the backend is in `app/main.js`.

## Running the container

[Podman](https://podman.io) is the preferred tool to run a container-image on a
local system like a laptop:

```console
podman run -ti --rm --publish=8080:8080 ghcr.io/nixpanic/simple-websocket:latest
```

Once the container is running, visit http://localhost:8080 to check if
everything is working.
