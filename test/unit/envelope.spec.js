const chai = require('chai');
const expect = chai.expect;

const envelope = require('../../lib/envelope');

describe('Envelope tools', () => {
    context('isValid', () => {
        it('should be false for invalid envelopes', () => {
            expect(envelope.isValid()).to.be.false;
            expect(envelope.isValid(null)).to.be.false;
            expect(envelope.isValid('zzz')).to.be.false;
        });

        it('should be false for envelopes with missing keys', () => {
            expect(envelope.isValid({ bodyInline: 'xxx', bodyLast: [] })).to.be.false;
            expect(envelope.isValid({ head: [], bodyLast: [] })).to.be.false;
        });

        it('should be true for a valid envelope', () => {
            expect(envelope.isValid({ head: [], bodyInline: 'blah', bodyLast: [] })).to.be.true;
        });

        context('with strict type checking', () => {
            it('should be false for an envelope with incorrect key types', () => {
                expect(envelope.isValid({ head: [], bodyInline: ['blah'], bodyLast: [] }, true)).to.be.false;
                expect(envelope.isValid({ head: '', bodyInline: 'blah', bodyLast: [] }, true)).to.be.false;
                expect(envelope.isValid({ head: [], bodyInline: {}, bodyLast: [] }, true)).to.be.false;
            });
        });
    });

    context('combine', () => {
        it('should just join head and bodyLast arrays for a single envelope', () => {
            const envs = [{ head: ['head'], bodyInline: 'body', bodyLast: ['last'] }];

            expect(envelope.combine(envs)).to.deep.equal(
                { head: 'head', bodyInline: 'body', bodyLast: 'last' }
            );
        });

        it('should combine two simple envelopes correctly', () => {
            const envs = [
                { head: ['head1'], bodyInline: 'body1', bodyLast: ['last1'] },
                { head: ['head2'], bodyInline: 'body2', bodyLast: ['last2'] }
            ];

            expect(envelope.combine(envs)).to.deep.equal({
                head: 'head1\nhead2',
                bodyInline: 'body1\nbody2',
                bodyLast: 'last1\nlast2'
            });
        });

        it('should combine multiple envelopes with empty components correctly', () => {
            const envs = [
                { head: [], bodyInline: 'body1', bodyLast: ['last1'] },
                { head: ['head2'], bodyInline: '', bodyLast: ['last2'] },
                { head: ['head3'], bodyInline: 'body3', bodyLast: [] }
            ];

            expect(envelope.combine(envs)).to.deep.equal({
                head: 'head2\nhead3',
                bodyInline: 'body1\n\nbody3',
                bodyLast: 'last1\nlast2'
            });
        });
    });
});
