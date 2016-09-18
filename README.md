# salieri

<p align="center">
[![Build Status](https://travis-ci.org/jamesdonoh/salieri.svg?branch=master)](https://travis-ci.org/jamesdonoh/salieri)
</p>

Tiny ES6 server for playing around with and debugging web component envelopes.

## Requirements

- Node.js v6 and above is required because some features of ES6 are used

## Installation

1. `git clone` this GitHub repo
2. Run `npm link` to be able to invoke it from anywhere (optional)

## Usage

```
$ salieri --help

Usage: salieri [options] -t <template> -c <config>

Options:
  --template, -t  path to page template                               [required]
  --config, -c    path to page config JSON                            [required]
  --cert          use specified client certificate for TLS
  --cacert        use specified CA certificate for TLS
  --labelall, -l  show labels for all components to help with debugging
                                                                [default: false]
  --help          Show help                                            [boolean]
```

For example:

```
$ salieri -c myconfig.json -t mytemplate.mustache`
```

Salieri runs on port 3000 by default. Once it is running, point your browser at http://localhost:3000/

## Parameters

Endpoint parameters may be passed via the query string and will be interpolated into the page config JSON, for example:

```
http://localhost:3000/?topic=8abd564a-2b8e-401c-9916-34982cb67b55&country=gb
```

## Troubleshooting

salieri uses the `request` module (via `request-promise`) to perform HTTP requests, so verbose console output to assist with debugging connection issues can be enabled by setting `NODE_DEBUG=request`; see https://github.com/request/request#debugging

### "unable to get local issuer certificate"

This error means that you have specified one or more HTTPS endpoints with certificates issued by unknown certificate authorities - use the `--cacert` option to specify the CA certificate.

## Tests

Unit and integration tests can be run via `npm test`. Use `npm lint` to check against coding standards. For more details see the `package.json`.

## Changelog

### 3.0.0

- restructured as a chain of Express middleware modules
- improved appearance of component labels and more helpful console output
- added integration tests to help make development safer
  
### 2.0.0

- refactored to make the code easier to maintain and extend
- added some unit tests
- added `labels` and `noerrors` debugging options
- command-line option parsing via [yargs](https://www.npmjs.com/package/yargs)

### 1.0.0

- Initial version

## Known issues/limitations

- Requests not batched up to each host
- Incomplete support for respecting `must_succeed` flag
