const chai = require('chai');
const spies = require('chai-spies');

const handleErrors = require('../../lib/handle-errors');

chai.use(spies);
const expect = chai.expect;

describe('Error handling', () => {
    let req;
    let app;

    beforeEach(() => {
        req = { app: { locals: { logError: chai.spy() } } };
        next = chai.spy();
    });

    const mockRes = (...components) => ({ locals: { components: components } });

    it('should call next', () => {
        const res = { locals: { components: [] } };

        handleErrors(req, res, next);

        expect(next).to.have.been.called();
    });

    it('should mark components with errors as failed', () => {
        const comp = { result: { error: { message: 'error message' } } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.status).to.equal('failed');
        expect(comp.reason).to.equal('error message');
    });

    it('should mark components with 202 responses as warnings', () => {
        const comp = { result: { statusCode: 202 } };
        const res = { locals: { components: [ comp ] } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.status).to.equal('warning');
    });

    it('should mark components with other non-200 response codes as errors', () => {
        const comp = { result: { statusCode: 400 } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.status).to.equal('failed');
    });

    it('should construct reason message using properties from HTTP response', () => {
        const comp = { result: { statusCode: 400, statusMessage: 'Bad request', body: 'Invalid parameters' } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.reason).to.equal('400 Bad request - Invalid parameters');
    });

    it('should mark components with non-JSON responses as failures', () => {
        const comp = { result: { statusCode: 200, body: 'hello' } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.status).to.equal('failed');
        expect(comp.reason).to.equal('Invalid envelope');
    });

    it('should mark components with invalid envelopes as failures', () => {
        const comp = { result: { statusCode: 200, body: { foo: 1 } } };

        handleErrors(req, mockRes(comp), next);

        expect(comp.status).to.equal('failed');
    });

    describe('compoments with valid envelopes', () => {
        const validEnvelope = {
            head: ['...', '...'],
            bodyInline: 'ooo',
            bodyLast: ['...']
        };

        it('should mark components as succeeded', () => {
            const comp = { result: { statusCode: 200, body: validEnvelope } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.status).to.equal('succeeded');
        });

        it('should set envelope property to parsed envelope', () => {
            const comp = { result: { statusCode: 200, body: validEnvelope } };

            handleErrors(req, mockRes(comp), next);

            expect(comp.envelope).to.deep.equal(validEnvelope);
        });
    });
});
