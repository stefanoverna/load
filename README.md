# Load - Simulate load on DatoCMS' graphql-listen Endpoints

Opens a number of connections to an endpoint and tracks each connection's
lifecycle.

# Configure

Modify config.js.

* baseUrl - the GraphQL Listen endpoint.
* connections - the number of connections to spawn.
* loopSleep - the delay in ms between the spawning of each conection. Smaller
  values mean more server load and less time for scaling to occur.
* query - the GraphQL query to run (should match the token's project).
* token - a DatoCMS API project token.
* variables - any variables to be passed alongside the GraphQL query.

# Run

```sh
$ node connect.js
```
