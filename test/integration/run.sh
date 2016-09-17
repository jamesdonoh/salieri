#!/bin/bash -e

DIRNAME="$(dirname $0)"
SALIERI_MODULE="$DIRNAME/../../lib/server.js"
SALIERI_CMD="node $SALIERI_MODULE $DIRNAME/config.json $DIRNAME/template.html"
URL=http://localhost:3000/?foo=1
CURL="curl -s -S -m 10"
EXPECTED="$DIRNAME/expected.html"
SLEEP_TIME=0.2
MAX_TRIES=50

trap 'running && kill $(jobs -p)' EXIT

function fail {
    echo "FAIL: $1"
    exit 1
}

function running {
    jobs %% &>/dev/null
}

function listening {
    nc -z -w 5 localhost $1 &>/dev/null
}

echo Starting saleri server
NODE_ENV=test $SALIERI_CMD &

TRIES=0
until listening 3000; do
    TRIES=$(($TRIES+1))
    if [ $TRIES -gt $MAX_TRIES ]; then
        fail "Server did not start in a timely fashion"
    elif ! running; then
        fail "Server process died unexpectedly"
    fi

    echo "Waiting for server to start..."
    sleep $SLEEP_TIME
done

if [ "$1" = "--update" ]; then
    echo "Updating expected output"
    $CURL $URL > "$EXPECTED"
    exit
fi

echo "Making HTTP request to $URL and checking response..."

if ! $CURL $URL | diff "$EXPECTED" -; then
    fail "Response did not match expected"
fi

echo PASS
