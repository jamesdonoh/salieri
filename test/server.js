const chai = require('chai'),
    assert = chai.assert,
    builder = require('../lib/server');

describe('Web Server', function () {
    describe('#start', function () {
        it('is a function', function () {
            assert.isFunction(builder.start);
        });
    });
});
