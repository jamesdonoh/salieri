'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const request = require('supertest');
const server = require('../lib/server');

describe('Web Server', function () {
    describe('#createServer', function () {
        it('is a function', function () {
            assert.isFunction(server.createServer);
        });

        describe('GET /', function () {
            it('responds with HTML', function (done) {
                const buildPage = () => Promise.resolve('page body');
                const app = server.createServer(buildPage);

                request(app)
                    .get('/')
                    .expect('Content-Type', /text\/html/)
                    .expect(200, done);
            });
        });

        describe('GET / with parameters', function () {
            it('passes parameters to page builder', function (done) {
                const buildPage = (params) => Promise.resolve(JSON.stringify(params));
                const app = server.createServer(buildPage);

                request(app)
                    .get('/?param1=foo&param2=bar')
                    .expect(200, '{"param1":"foo","param2":"bar"}', done);
            });
        });

        describe('Errors', function () {
            let sandbox;

            beforeEach(function () {
                sandbox = sinon.sandbox.create();
                sandbox.stub(console, 'error');
            });

            afterEach(function () {
                sandbox.restore();
            });

            it('displays error page for sync errors thrown by page builder', function (done) {
                const buildPage = () => {
                    throw new Error('_sync error_');
                };
                const app = server.createServer(buildPage);

                request(app)
                    .get('/')
                    .expect('Content-Type', /text\/html/)
                    .expect(500, /_sync error_/, done);
            });

            it('displays error page for async errors thrown by page builder', function (done) {
                const buildPage = () =>
                    new Promise((resolve, reject) => reject(new Error('_async error_')));
                const app = server.createServer(buildPage);

                request(app)
                    .get('/')
                    .expect('Content-Type', /text\/html/)
                    .expect(500, /_async error_/, done);
            });
        });
    });
});
