const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('Rendering template', () => {
    const mustacheStub = {};
    const envelopeStub = {};
    const stubs = {
        'mustache': mustacheStub,
        './envelope': envelopeStub
    };

    let renderTemplate;
    let req;

    beforeEach(() => {
        renderTemplate = proxyquire('../../lib/renderTemplate', stubs);

        req = { app: { locals: { } } };
        res = { locals: { components: [] }, send: chai.spy() };

        envelopeStub.combine = chai.spy();
        mustacheStub.render = chai.spy();
    });

    it('should combine component envelopes', () => {
        const envelopes = [
            { bodyInline: 'x' },
            { bodyInline: 'y' }
        ];
        res.locals.components = [
            { envelope: envelopes[0] },
            { envelope: envelopes[1] }
        ];

        renderTemplate(req, res);

        expect(envelopeStub.combine).to.have.been.called.with(envelopes);
    });

    it('should use Mustache to render the page template using combined envelope data', () => {
        req.app.locals.template = '<<a template>>';
        const envelopeData = { value: 1 };
        envelopeStub.combine = () => envelopeData;

        renderTemplate(req, res);

        expect(mustacheStub.render).to.have.been.called.with(req.app.locals.template, envelopeData);
    });

    it('should send the rendered response to the client', () => {
        const page = '<html>page</html>';
        mustacheStub.render = () => page;

        renderTemplate(req, res);

        expect(res.send).to.have.been.called.with(page);
    });
});
