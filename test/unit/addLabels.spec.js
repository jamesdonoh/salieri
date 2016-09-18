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

    let addLabels;
    let req;
    let res;
    let next;

    beforeEach(() => {
        addLabels = proxyquire('../../lib/addLabels', stubs);

        req = { app: { locals: { } } };
        res = { locals: { components: [] } };
        next = chai.spy('next');
    });

    afterEach(() => {
        expect(next).to.have.been.called.once();
    });

    context('components that did not succeed', () => {
        const expected = '<div class="sal-label sal-label--failed">foo [failed]: some reason</div>';

        beforeEach(() => {
            res.locals.components = [
                {
                    id: 'foo',
                    status: 'failed',
                    reason: 'some reason'
                }
            ];
        });

        afterEach(() => {
            expect(stringUtilsStub.escapeHtml).to.have.been.called.with('foo [failed]: some reason');
        });

        it('should add a label', () => {
            addLabels(req, res, next);

            expect(res.locals.components[0].envelope.bodyInline).to.equal(expected);
        });

        it('should prepend label if there is already an envelope', () => {
            res.locals.components[0].envelope = {
                bodyInline: 'original'
            };

            addLabels(req, res, next);

            expect(res.locals.components[0].envelope.bodyInline).to.equal(expected + 'original');
        });
    });

    context('components that succeeded', () => {
        beforeEach(() => {
            res.locals.components = [
                {
                    id: 'bar',
                    status: 'succeeded',
                    envelope: { bodyInline: 'the body' }
                }
            ];
        });

        it('should not add a label', () => {
            addLabels(req, res, next);

            expect(res.locals.components[0].envelope.bodyInline).to.equal('the body');
        });

        context('labelAll mode', () => {
            it('should add a label', () => {
                req.app.locals.labelAll = true;

                addLabels(req, res, next);

                const expected = '<div class="sal-label sal-label--succeeded">bar ⌄</div>the body'
                expect(res.locals.components[0].envelope.bodyInline).to.equal(expected);
            });
        });
    });

    context('label styles component', () => {
        it('should be added if more than one label was added', () => {
            res.locals.components = [
                {
                    status: 'failed'
                }
            ];

            addLabels(req, res, next);

            expect(res.locals.components).to.include(stylesStub);
            expect(res.locals.components).to.have.length(2);
        });

        it('should not be added if no labels were added', () => {
            addLabels(req, res, next);

            expect(res.locals.components).not.to.include(stylesStub);
        });
    });
});
