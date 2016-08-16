# salieri

Tiny ES6 server for playing around with and debugging web component envelopes.

## Requirements

- Node.js v6.0.0 or later

## Usage

```
$ npm install
$ node index.js --help

Usage: index.js [options] -t <template> -c <config>

Options:
  --template, -t  path to page template                                [required]
  --config, -c    path to page config JSON                             [required]
  --cert          use specified client certificate for TLS
  --cacert        use specified CA certificate for TLS
  --labels        show component labels to help with debugging         [default: false]
  --noerrors      do not display request errors in markup              [default: false]
  --staticprefix  prefix which identifies a request for a static asset [default: /img]
  --statichost    where to send requests for static assets             [default: localhost]
  --staticpath    path on the statichost where the static assets are   [default: /img]
  --help          Show help                                            [boolean]
```

Once the server is running, point your browser at http://localhost:3000/

The `staticprefix`, `statichost` and `staticpath` are used to provide access to static assets.
For example, if your CSS has an image sprite addressed as `url(img/news--icons-sprite.png)`, by running
a local webserver on port 80 in the same directory as the `img` directory, and using the default values,
requests to `localhost:3000/img/news--icons-sprite.png` will be proxied to `localhost:/img/news--icons-sprite.png`

Another example is using the build-in web server on the Mac and creating a symlink to your Morph module:

```
cd /Library/WebServer/Documents
ln -s /Users/myusername/morph-modules/my-morph-module my-morph-module
```

The Salieri parameters would be `--staticprefix /img --statichost localhost --staticpath my-morph-module/public/img`.


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
