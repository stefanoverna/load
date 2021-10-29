import path from 'path';
import fetch from 'node-fetch';
import { subscribeToQuery } from 'datocms-listen';
import EventSource from 'eventsource';
import { query, variables, token } from './config.js';

const CONNECTIONS = 1000;
const CONNECTION_LOOP_SLEEP_MS = 50;

const args = process.argv.slice(2);

const baseUrl = args[0] || 'http://localhost:4001';

let updates = 0;

const log = message => {
  console.log(`${(new Date()).toLocaleTimeString()}: ${message}`);
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
      log(`Status ${i}: ${status}!`);
    },
    onChannelError: (error) => {
      // error will be something like:
      // {
      //   code: "INVALID_QUERY",
      //   message: "The query returned an erroneous response. Please consult the response details to understand the cause.",
      //   response: {
      //     errors: [
      //       {
      //         fields: ["query", "allBlogPosts", "nonExistingField"],
      //         locations: [{ column: 67, line: 1 }],
      //         message: "Field 'nonExistingField' doesn't exist on type 'BlogPostRecord'",
      //       },
      //     ],
      //   },
      // }
      console.error(`Error ${i}: ${error.message}`);
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
  log(`Received ${updates} updates`);
  updates = 0;
}, 5000);
