const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('Error handling', () => {
    const stringUtilsStub = {
        excerpt: (val) => val
    };
    const envelopeStub = {
        isValid: () => false
    };
    const stubs = {
        './stringUtils': stringUtilsStub,
        './envelope': envelopeStub
    };

    let handleErrors;
    let req;
    let res;
    let next;

    beforeEach(() => {
        handleErrors = proxyquire('../../lib/handleErrors', stubs);

        req = { app: { locals: { } } };
        res = { locals: { components: [] } };
        next = chai.spy('next');
    });

    afterEach(() => {
        expect(next).to.have.been.called.once();
    });

    describe('unsuccessful envelopes', () => {
        it('should mark components with errors as failed', () => {
            res.locals.components = [{ result: { error: { message: 'error message' } } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].status).to.equal('failed');
            expect(res.locals.components[0].reason).to.equal('error message');
        });

        it('should mark components with 202 responses as warnings', () => {
            res.locals.components = [{ result: { statusCode: 202 } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].status).to.equal('warning');
        });

        it('should mark components with other non-200 response codes as errors', () => {
            res.locals.components = [{ result: { statusCode: 400 } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].status).to.equal('failed');
        });

        it('should construct reason message using HTTP response', () => {
            res.locals.components = [{ result: { statusCode: 400, statusMessage: 'Bad request', body: 'Invalid parameters' } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].reason).to.equal('400 Bad request - Invalid parameters');
        });

        it('should mark components with invalid envelopes responses as failures', () => {
            res.locals.components = [{ result: { statusCode: 200, body: 'hello' } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].status).to.equal('failed');
            expect(res.locals.components[0].reason).to.equal('Invalid envelope');
        });

        it('should log errors if logging enabled', () => {
            res.locals.components = [{ id: 'x', result: { error: { message: 'blah' } } }];
            req.app.locals.logError = chai.spy('logErrors');

            handleErrors(req, res, next);

            expect(req.app.locals.logError).to.have.been.called.with('x failed - blah');
        });

        describe('strict mode', () => {
            before(() => req.app.locals.strictMode = true);

            it('should invole error-handling middleware if component failed', () => {
                const err = new Error('blah');
                res.locals.components = [{ id: 'y', must_succeed: true, result: { error: err } }];
                req.app.locals.strictMode = true;

                handleErrors(req, res, next);

                expect(next).to.have.been.called.with(err);
            });
        });
    });

    describe('successful envelopes', () => {
        it('should mark components with valid envelopes as succeeded', () => {
            res.locals.components = [{ result: { statusCode: 200, body: 'valid' } }];
            envelopeStub.isValid = () => true;

            handleErrors(req, res, next);

            expect(res.locals.components[0].status).to.equal('succeeded');
        });

        it('should set envelope property to parsed envelope', () => {
            const envelope = { head: [], bodyInline: 'x' };
            res.locals.components = [{ result: { statusCode: 200, body: envelope } }];

            handleErrors(req, res, next);

            expect(res.locals.components[0].envelope).to.deep.equal(envelope);
        });
    });
});
