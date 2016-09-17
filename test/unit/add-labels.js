const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('Adding component labels', () => {
    const stringUtilsStub = {
        escapeHtml: chai.spy((val) => val)
    };
    const stylesStub = { envelope: { bodyInline: 'stub styles' } };
    const stubs = {
        './stringUtils': stringUtilsStub,
        './styles': stylesStub
    };

    const mockRes = (...components) => ({ locals: { components: components } });

    let addLabels;
    let req;
    let next;

    beforeEach(() => {
        addLabels = proxyquire('../../lib/add-labels', stubs);

        req = { app: { locals: { } } };
        next = chai.spy('next');
    });

    afterEach(() => {
        expect(next).to.have.been.called.once();
    });

    context('components that did not succeed', () => {
        const expectedLabel = '<div class="sal-label sal-label--failed">foo [failed]: some reason</div>';
        let comp;

        beforeEach(() => {
            comp = {
                id: 'foo',
                status: 'failed',
                reason: 'some reason'
            };
        });

        afterEach(() => {
            expect(stringUtilsStub.escapeHtml).to.have.been.called.with('foo [failed]: some reason');
        });

        it('should add a label', () => {
            addLabels(req, mockRes(comp), next);

            expect(comp.envelope.bodyInline).to.equal(expectedLabel);
        });

        it('should prepend label if there is already an envelope', () => {
            comp.envelope = {
                bodyInline: 'original body'
            };
            const res = mockRes(comp);

            addLabels(req, mockRes(comp), next);

            expect(comp.envelope.bodyInline).to.equal(expectedLabel + 'original body');
        });
    });

    context('components that succeeded', () => {
        let comp;

        beforeEach(() => {
            comp = {
                id: 'bar',
                status: 'succeeded',
                envelope: { bodyInline: 'the body' }
            };
        });

        it('should not add a label', () => {
            addLabels(req, mockRes(comp), next);

            expect(comp.envelope.bodyInline).to.equal('the body');
        });

        context('labelAll mode', () => {
            it('should add a label', () => {
                req.app.locals.labelAll = true;

                addLabels(req, mockRes(comp), next);

                const expected = '<div class="sal-label sal-label--succeeded">bar ⌄</div>the body'
                expect(comp.envelope.bodyInline).to.equal(expected);
            });
        });
    });

    context('label styles component', () => {
        it('should be added if more than one label was added', () => {
            const res = mockRes({ status: 'failed' });

            addLabels(req, res, next);

            expect(res.locals.components).to.include(stylesStub);
            expect(res.locals.components).to.have.length(2);
        });

        it('should not be added if no labels were added', () => {
            const res = mockRes();
            addLabels(req, res, next);

            expect(res.locals.components).not.to.include(stylesStub);
        });
    });
});
