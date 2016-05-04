# salieri

## Requirements

- Node.js v5.9 or later

## Usage

```
npm install
node index.js _template.html_ _config.json_ _[params.json]_
```

#### Certificate support

```
CERT_FILE=/path/to/mycert.pem CA_FILE=/path/to/ca.pem node index.js ...
```

#### Known issues/limitations

- Only static parameters currently supported (specified in _params.json_)
- Requests not batched to each host
- `must_succeed: false` option in config is ignored
