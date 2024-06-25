const { readFileSync } = require('node:fs');
const http = require('node:http');
const { parse } = require('url');
const { WebSocketServer } = require('ws');

const LISTEN_PORT = 8080;

/* error responses */
const HTTP_403_RESPONSE = 'Sorry, you are not allowed to do that.\n';
const HTTP_404_RESPONSE = 'The page you requested could not be found.\n';

/* known static pages */
const INDEX_HTML = readFileSync('../html/index.html');
const WS_JS = readFileSync('../html/ws.js');

/* internal facing WebSocket server */
const wss = new WebSocketServer({ noServer: true });

/* connection event
 */
wss.on('connection', (ws, req) => {
    let client = req.socket.remoteAddress;

    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded !== undefined) {
        client = forwarded;
    }

    console.log(`connection established to ${client}`);
    ws.send(`nice, you (${client}) connected to the simple-websocket`);

    ws.on('message', (data) => {
        ws.send(`received ${data.length} bytes from you, thanks!`);
    });
});


/* public facing webserver */
const server = http.createServer();

/* request event
 *
 * Check for GET method, return only known static pages.
 */
server.on('request', (req, res) => {
    if (req.method !== 'GET') {
        res.writeHead(
            403 /* permission denied */,
            {
                'Content-Length': Buffer.byteLength(HTTP_403_RESPONSE),
                'Content-Type': 'text/plain',
            },
        );
        res.end(HTTP_403_RESPONSE);
        return;
    }

    let code = 200; /* OK */
    let contentType = 'text/plain';
    let data = '';

	const { pathname } = parse(req.url);
    switch (pathname) {
        case '':
        case '/':
        case '/index.html':
            contentType = 'text/html';
            data = INDEX_HTML;
            break;

        case '/ws.js':
            contentType = 'text/javascript';
            data = WS_JS;
            break;

        default:
            code = 404; /* not found */
            data = HTTP_404_RESPONSE;
            break;
    }
    
    res.writeHead(
        code,
        {
            'Content-Length': Buffer.byteLength(data),
            'Content-Type': contentType
        },
    );
    res.end(data);
});

server.on('upgrade', (req, sock, head) => {
	const { pathname } = parse(req.url);

	if (pathname === '/ws') {
        /* handle the upgrade and send the reques to the WebSocket server */
		wss.handleUpgrade(req, sock, head, (ws) => {
			wss.emit('connection', ws, req);
		});
	} else {
		sock.destroy();
	}
});

server.listen(LISTEN_PORT);
