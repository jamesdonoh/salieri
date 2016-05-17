const chai = require('chai'),
    assert = chai.assert,
    makeBuilder = require('../lib/builder').makeBuilder;

describe('Page Builder', function () {
    describe('#makeBuilder', function () {
        it('should return a function', function () {
            assert.isFunction(makeBuilder());
        });

        it('should build a static page', function () {
            const template = 'Hello', 
                buildPage = makeBuilder(template);

            return buildPage().then((page) =>
                assert.strictEqual(page, 'Hello'));
        });

        it('should build a page with dynamic properties', function () {
            const template = '{{greeting}}, {{name}}.', 
                reduceResponses = (responses) => ({ greeting: 'Hello', name: 'Lyra' });

            const buildPage = makeBuilder(template, reduceResponses),
                page = buildPage();

            return buildPage().then((page) =>
                assert.strictEqual(page, 'Hello, Lyra.'));
        });

        it('should reduce responses in order of endpoint config', function () {
            const config = {
                    components: [
                        { endpoint: 'first' },
                        { endpoint: 'second' },
                        { endpoint: 'third' }
                    ]
                };
            
            const template = '{{body}}',
                reduceResponses = (responses) => ({ body: responses.join() }),
                request = (url) => url;

            const buildPage = makeBuilder(template, reduceResponses, config, request);

            return buildPage().then((page) =>
                assert.strictEqual(page, 'first,second,third'));
        });

        it('should expand {{parameters}} within endpoint URLs', function () {
            let requestedUrl = null;

            const config = {
                    components: [
                        { endpoint: 'http://{{hostname}}/favicon.ico' }
                    ]
                };
            
            const request = (arg) => requestedUrl = arg,
                params = { hostname: 'squeak.com' };

            const buildPage = makeBuilder('', null, config, request, params);

            return buildPage().then(() =>
                assert.strictEqual(requestedUrl, 'http://squeak.com/favicon.ico'));
        });

        it('should handle failed requests', function () {
            //TBD
        });
    });
});
