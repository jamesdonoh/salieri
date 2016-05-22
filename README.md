# salieri

Tiny ES6 server for playing around with and debugging web component envelopes.

## Requirements

- Node.js v5.9 or later

## Usage

```
$ npm install
$ node index.js template.html config.json [params.json]
```

Then point your browser at http://localhost:3000/.

## Parameters

Endpoint parameters may be passed via the query string, e.g.
http://localhost:3000/?topic=8abd564a-2b8e-401c-9916-34982cb67b55&country=gb

## Debugging

The `envelope` module supports the following options to aid with debugging:

- showErrors: if `true`, add an error message to the page for any components that
  could not be requested or parsed (default `true`)
- addLabels: prepends the bodyInline of each component with an HTML label containing
  the component's `id` property (default `false`)

#### Certificate support

```
$ CERT_FILE=/path/to/mycert.pem CA_FILE=/path/to/ca.pem node index.js ...
```

#### Known issues/limitations

- Requests not batched to each host
- No support for `must_succeed: false` option
