function log(msg) {
    document.getElementById("log").innerHTML += `${new Date()}: ${msg}<br/>`;
}

window.addEventListener('load', () => {
  const protocol = (document.location.protocol === 'https:' ? 'wss:' : 'ws:');
  const ws = new WebSocket(protocol + '//' + document.location.host + '/ws');

  // delayedPing schedules a ping every 30 seconds
  function delayedPing(/* data, ignored */) {
    setTimeout(() => {
      log('sending ping');
      ws.send('ping');
      delayedPing();
    }, 30000);
  }

  // trigger the 1st ping, it'll continue running afterwards
  delayedPing();

  ws.onopen = () => {
     log('connected to API ws');
  };

  ws.onclose = (err) => {
     log('WebSocket was closed:', err);
  };

  ws.onerror = (err) => {
     log('WebSocket got an error:', err);
  };

  ws.onmessage = (res) => {
     log(`received data: ${res.data}`);
  };
});
