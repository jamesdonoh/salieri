const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('Error handling', () => {
    const stringUtilsStub = {
        excerpt: (val) => val
    };
    const envelopeUtilsStub = {
        isValid: () => false
    };
    const stubs = {
        './stringUtils': stringUtilsStub,
        './envelopeUtils': envelopeUtilsStub
    };

    const mockRes = (...components) => ({ locals: { components: components } });

    let handleErrors;
    let req;
    let next;

    beforeEach(() => {
        handleErrors = proxyquire('../../lib/handleErrors', stubs);

        req = { app: { locals: { } } };
        next = chai.spy('next');
    });

    afterEach(() => {
        expect(next).to.have.been.called.once();
    });

    describe('unsuccessful envelopes', () => {
        it('should mark components with errors as failed', () => {
            const comp = { result: { error: { message: 'error message' } } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('failed');
            expect(comp.reason).to.equal('error message');
        });

        it('should mark components with 202 responses as warnings', () => {
            const comp = { result: { statusCode: 202 } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('warning');
        });

        it('should mark components with other non-200 response codes as errors', () => {
            const comp = { result: { statusCode: 400 } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('failed');
        });

        it('should construct reason message using HTTP response', () => {
            const comp = { result: { statusCode: 400, statusMessage: 'Bad request', body: 'Invalid parameters' } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.reason).to.equal('400 Bad request - Invalid parameters');
        });

        it('should mark components with invalid envelopes responses as failures', () => {
            const comp = { result: { statusCode: 200, body: 'hello' } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('failed');
            expect(comp.reason).to.equal('Invalid envelope');
        });

        it('should log errors if logging enabled', () => {
            const comp = { id: 'x', result: { error: { message: 'blah' } } };
            req.app.locals.logError = chai.spy('logErrors');

            handleErrors(req, mockRes(comp), next);

            expect(req.app.locals.logError).to.have.been.called.with('x failed - blah');
        });

        describe('strict mode', () => {
            before(() => req.app.locals.strictMode = true);

            it('should invole error-handling middleware if component failed', () => {
                const err = new Error('blah');
                const comp = { id: 'y', must_succeed: true, result: { error: err } };
                req.app.locals.strictMode = true;

                handleErrors(req, mockRes(comp), next);

                expect(next).to.have.been.called.with(err);
            });
        });
    });

    describe('successful envelopes', () => {
        it('should mark components with valid envelopes as succeeded', () => {
            const comp = { result: { statusCode: 200, body: 'valid' } };
            envelopeUtilsStub.isValid = () => true;

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('succeeded');
        });

        it('should set envelope property to parsed envelope', () => {
            const envelope = { head: [], bodyInline: 'x' };
            const comp = { result: { statusCode: 200, body: envelope } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.envelope).to.deep.equal(envelope);
        });
    });
});
