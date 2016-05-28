# salieri

Tiny ES6 server for playing around with and debugging web component envelopes.

## Requirements

- Node.js v4.0 or later

## Usage

```
$ npm install
$ node index.js --help

Usage: index.js [options] -t <template> -c <config>

Options:
  --template, -t  path to page template                               [required]
  --config, -c    path to page config JSON                            [required]
  --cert          use specified client certificate for TLS
  --cacert        use specified CA certificate for TLS
  --labels        show component labels to help with debugging  [default: false]
  --noerrors      do not display request errors in markup       [default: false]
  --help          Show help                                            [boolean]
```

Once the server is running, point your browser at http://localhost:3000/

## Parameters

Endpoint parameters may be passed via the query string, e.g.
http://localhost:3000/?topic=8abd564a-2b8e-401c-9916-34982cb67b55&country=gb

## Tests

Unit tests can be run with:

```
npm test
```

If you have `eslint` installed, it can be used to check against coding standards.

## Changelog

### 2.0.0

- Refactored to make the code easier to maintain and extend
- Added some unit tests
- Added `labels` and `noerrors` debugging options
- Command-line option parsing via [yargs](https://www.npmjs.com/package/yargs)

### 1.0.0

- Initial version

## Known issues/limitations

- Envelope handling makes assumptions about envelope keys in use
- Requests not batched up to each host
- No support for `must_succeed: false` config option (although `--noerrors` may be used)
