import path from 'path';
import fetch from 'node-fetch';
import { subscribeToQuery } from 'datocms-listen';
import EventSource from 'eventsource';
import { baseUrl, query, variables, token } from './config.js';

const CONNECTIONS = 41;
const CONNECTION_LOOP_SLEEP_MS = 100;

let updates = 0;

const log = (type, message) => {
  switch(type) {
  case 'error':
    console.error(`${(new Date()).toLocaleTimeString()}: ${message}`);
    break;
  default:
    console.info(`${(new Date()).toLocaleTimeString()}: ${message}`);
  }
};

const connect = async (i) => {
  return await subscribeToQuery({
    baseUrl,
    eventSourceClass: EventSource,
    fetcher: fetch,
    query,
    variables,
    token,
    preview: false,
    onUpdate: () => {
      updates += 1;
    },
    onStatusChange: (status) => {
      // status can be "connected", "connecting" or "closed"
      log('info', `Status ${i+1}: ${status}!`);
    },
    onChannelError: (error) => {
      log('error', `Error ${i+1}: ${error.message}`);
    },
  });
};

async function run() {
  for (let i = 0; i < CONNECTIONS; i++) {
    await new Promise(resolve => setTimeout(resolve, CONNECTION_LOOP_SLEEP_MS));
    connect(i);
  }
}

run();

setInterval(() => {
  log('info', `${updates} updates, ${connecting} connecting, ${connected} connected, ${dead} dead`);
  updates = 0;
}, 5000);
