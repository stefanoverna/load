import path from 'path';
import fetch from 'node-fetch';
import { subscribeToQuery } from 'datocms-listen';
import EventSource from 'eventsource';
import { baseUrl, connections, loopSleep, query, variables, token } from './config.staging.js';

let updates = 0;
const states = {};

const log = (type, message) => {
  switch(type) {
  case 'error':
    console.error(`${(new Date()).toLocaleTimeString()}: ${message}`);
    break;
  default:
    console.info(`${(new Date()).toLocaleTimeString()}: ${message}`);
  }
};

const connect = (i) => {
  const state = {
    i: i,
    errors: [],
    status: 'closed'
  };
  state.unsubscribe = subscribeToQuery({
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
      state.status = status
    },
    onChannelError: (error) => {
      state.status = 'closed';
      log('error', `Error ${i+1}: ${error.message}`);
    },
    onError: (errorData) => {
      state.status = errorData.status;
      state.errors.push(errorData.error.message);
      log('error', `Error ${i+1}: ${state.errors.join(' -> ')}`);
    },
  });
  return state;
};

async function run() {
  for (let i = 0; i < connections; i++) {
    await new Promise(resolve => setTimeout(resolve, loopSleep));
    const state = connect(i);
    states[state.i] = state;
  }
}

run();

setInterval(() => {
  const statuses = Object.keys(states).reduce((statuses, key) => {
    const state = states[key];
    statuses[state.status]++;
    return statuses;
  }, {'closed': 0, 'connecting': 0, 'connected': 0});
  log('info', `${updates} updates, ${statuses['connecting']} connecting, ${statuses['connected']} connected, ${statuses['closed']} closed`);
  updates = 0;
}, 1000);
