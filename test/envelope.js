const assert = require('chai').assert,
    envelope = require('../lib/envelope');

describe('Envelope Utilities', function () {
    describe('#combine', function () {
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
});
