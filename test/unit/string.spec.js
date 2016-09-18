const chai = require('chai');
const string = require('../../lib/string');
const expect = chai.expect;

describe('String helpers', () => {

    describe('escapeHtml', () => {
        it('should escape special characters', () => {
            expect(string.escapeHtml('<hello href="no">You can\'t')).to.equal('&lt;hello href=&quot;no&quot;&gt;You can&#039;t');
        });
    });

    describe('excerpt', () => {
        it('should return the whole string if <= specified length', () => {
            expect(string.excerpt('potato', 6)).to.equal('potato');
        });

        it('should return an excerpt with ellipsis if > specified length', () => {
            expect(string.excerpt('supercalifragilisticexpialidocious', 5)).to.equal('super...');
        });

        it('should minimise whitespace', () => {
            expect(string.excerpt('Antici   \tpation', 15)).to.equal('Antici pation');
            expect(string.excerpt('   ooo  ', 10)).to.equal('ooo');
        });
    });
});
