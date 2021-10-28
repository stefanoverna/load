const fetch = require('node-fetch');
const { subscribeToQuery } = require('datocms-listen');
const EventSource = require('eventsource');

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
    query: `
      query HomePage($limit: IntType) {
        posts: allPosts(first: $limit, orderBy: _firstPublishedAt_DESC) {
          id
          content
          _firstPublishedAt
          photos {
            responsiveImage(imgixParams: {auto: [format]}) {
              ...imageFields
            }
          }
          author {
            name
            avatar {
              responsiveImage(imgixParams: {auto: [format], w: 60}) {
                ...imageFields
              }
            }
          }
        }
      }
      fragment imageFields on ResponsiveImage {
        aspectRatio
        base64
        height
        sizes
        src
        srcSet
        width
        alt
        title
      }
    `,
    variables: { limit: 20 },
    token: '73594ec74429bc333ed6ab1fcbc02e',
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
