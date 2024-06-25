function log(msg) {
    document.body.innerHTML += `${new Date()}: ${msg}<br/>`;
}

window.addEventListener('load', () => {
  const protocol = (document.location.protocol === 'https:' ? 'wss:' : 'ws:');
  const ws = new WebSocket(protocol + '//' + document.location.host + '/ws');

  // delayedPing schedules a ping every 30 seconds
  function delayedPing(/* data, ignored */) {
    setTimeout(() => {
      log('sending ping');
      ws.send('ping');
    }, 30000);
  }

  // trigger the 1st ping, it'll continue running afterwards
  delayedPing();

  ws.onopen = () => {
     log('connected to API ws');
  };

  ws.onclose = (err) => {
     log(`WebSocket was closed with error code ${err}`);
  };

  ws.onmessage = (res) => {
     log(`received data: ${res.data}`);
  };
});
