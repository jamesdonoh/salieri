const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('Preparing component requests', () => {
    const stubs = {
        'mustache': {}
    };
    
    let prepareRequests;
    let req;
    let res;
    let next;

    beforeEach(() => {
        prepareRequests = proxyquire('../../lib/prepareRequests', stubs);

        req = { app: { locals: { } } };
        res = { locals: { } };
        next = chai.spy('next');
    });

    afterEach(() => {
        expect(next).to.have.been.called.once();
    });

    it('should use Mustache to render config JSON using query parameters', () => {
        req.app.locals.config = '{ "some": "config" }';
        req.query = { param: 'some value' };
        stubs.mustache.render = chai.spy((str) => str);

        prepareRequests(req, res, next);

        expect(stubs.mustache.render).to.have.been.called.with(req.app.locals.config, req.query);
    });

    it('should store prepared component data in response locals', () => {
        stubs.mustache.render = (str) => '{ "components": [{ "a": "one"}, { "b": "two" }] }';

        prepareRequests(req, res, next);

        expect(res.locals.components).to.deep.equal([{ a: 'one' }, { b: 'two' }]);
    });
});
