const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

describe('Making component requests', () => {
    const req = {};
    const getMakeRequests = (rpStub) => require('../../lib/makeRequests')(rpStub);

    it('should pass endpoint URLs to request-promise', () => {
        const rpStub = chai.spy(() => Promise.resolve());
        const makeRequests = getMakeRequests(rpStub);
        const res = { locals: { components: [{ endpoint: 'some-url' }, { endpoint: 'other-url' }] } };
        const next = chai.spy();

        makeRequests(req, res, next);

        expect(rpStub).to.have.been.called.twice();
        expect(rpStub).to.have.been.called.with.exactly('some-url');
        expect(rpStub).to.have.been.called.with.exactly('other-url');
    });

    it('should attach fulfilled promise values to the component', (done) => {
        const rpStub = () => Promise.resolve('<<response data>>');
        const makeRequests = getMakeRequests(rpStub);
        const res = { locals: { components: [{ endpoint: 'some-url' }] } };
        const next = () => {
            expect(res.locals.components[0].result).to.equal('<<response data>>');
            done();
        }

        makeRequests(req, res, next);
    });

    it('should attach rejected promises values to the component', (done) => {
        const rpStub = () => Promise.reject('ERROR');
        const makeRequests = getMakeRequests(rpStub);
        const res = { locals: { components: [{ endpoint: 'some-url' }] } };
        const next = () => {
            expect(res.locals.components[0].result).to.equal('ERROR');
            done();
        }

        makeRequests(req, res, next);
    });
});
