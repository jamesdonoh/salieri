# salieri

Tiny ES6 server for playing around with experimental web component envelopes.

## Requirements

- Node.js v5.9 or later

## Usage

```
$ npm install
$ node index.js template.html config.json [params.json]
```

The optional `params.json` file should contain static parameters for endpoint URLs, e.g.:

```
{
    "country": "gb"
}
```

#### Certificate support

```
$ CERT_FILE=/path/to/mycert.pem CA_FILE=/path/to/ca.pem node index.js ...
```

#### Known issues/limitations

- Only static parameters currently supported
- Requests not batched to each host
- `must_succeed: false` option in config is ignored
