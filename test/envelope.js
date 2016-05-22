const assert = require('chai').assert;
const sinon = require('sinon');

sinon.assert.expose(assert, { prefix: '' });

describe('Envelope Tools', function () {
    describe('#parse', function () {
        const body = '{ "bodyInline": "component body" }';
        const component = { id: 'some-id' };

        describe('with addLabels option not specified', function () {
            const envelope = require('../lib/envelope')();

            it('should parse JSON', function () {
                assert.deepEqual(envelope.parse(body, component), { bodyInline: 'component body' });
            });
        });

        describe('with addLabels option set to true', function () {
            const envelope = require('../lib/envelope')({ addLabels: true });

            it('should parse JSON and add component ID to bodyInline', function () {
                const bodyInline = envelope.parse(body, component).bodyInline;

                assert.match(bodyInline, /some-id/);
                assert.match(bodyInline, /component body/);
            });
        });
    });

    describe('#combine', function () {
        const envelope = require('../lib/envelope')();

        it('should handle null or empty array input', function () {
            const emptyEnvelope = { head: '', bodyInline: '', bodyLast: '' };

            assert.deepEqual(envelope.combine(null), emptyEnvelope);
            assert.deepEqual(envelope.combine([]), emptyEnvelope);
        });

        it('should return empty strings for keys with no data', function () {
            const envelopes = [{ bodyInline: 'inline-text' }];

            const result = envelope.combine(envelopes);

            assert.deepEqual(result, { head: '', bodyInline: 'inline-text', bodyLast: '' });
        });

        it('should discard spurious envelope keys', function () {
            const envelopes = [{ bodyInline: 'inline-text', water: 'lovely' }];

            const result = envelope.combine(envelopes);

            assert.notProperty(result, 'water');
        });

        it('should concatenate simple string key values', function () {
            const envelopes = [
                { head: 'head1' },
                { head: 'head2' }
            ];

            const result = envelope.combine(envelopes);

            assert.strictEqual(result.head, 'head1\nhead2');
        });

        it('should concatenate array key values', function () {
            const envelopes = [
                { head: ['head1', 'head2'] },
                { head: [] },
                { head: 'head3' }
            ];

            const result = envelope.combine(envelopes);

            assert.strictEqual(result.head, 'head1\nhead2\nhead3');
        });

        it('should treat null key values as empty strings', function () {
            const envelopes = [
                { head: 'head1' },
                { head: null },
                { head: 'head2' }
            ];

            const result = envelope.combine(envelopes);

            assert.strictEqual(result.head, 'head1\n\nhead2');
        });
    });

    describe('#recoverError', function () {
        const component = { endpoint: 'http://internets.com/' };
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            sandbox.stub(console, 'error');
        });

        afterEach(function () {
            sandbox.restore();
        });

        describe('with showErrors option not specified', function () {
            const envelope = require('../lib/envelope')();

            it('should return a failure message containing the URL', function () {
                const bodyInline = envelope.recoverError(new Error(), component).bodyInline;

                assert.match(bodyInline, /FAILED: http:\/\/internets.com\//);
                assert.called(console.error);
            });
        });

        describe('with showErrors option set to false', function () {
            const envelope = require('../lib/envelope')({ showErrors: false });

            it('should return an empty object', function () {
                assert.deepEqual(envelope.recoverError(new Error(), component), {});
                assert.called(console.error);
            });
        });
    });
});
