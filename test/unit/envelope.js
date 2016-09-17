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

        it('should be false for an envelope with incorrect key types', () => {
            expect(envelope.isValid({ head: [], bodyInline: ['blah'], bodyLast: [] })).to.be.false;
            expect(envelope.isValid({ head: '', bodyInline: 'blah', bodyLast: [] })).to.be.false;
            expect(envelope.isValid({ head: [], bodyInline: {}, bodyLast: [] })).to.be.false;
        });

        it('should be true for an envelope with correct key types', () => {
            expect(envelope.isValid({ head: [], bodyInline: 'blah', bodyLast: [] })).to.be.true;
        });
    });

    context('combine', () => {
        it('should be identity function for input of one envelope');
        it('should combine two envelopes correctly');
        it('should combine other numbers of envelopes correctly');
        it('should throw an error if an invalid envelope is given');
    });
});
