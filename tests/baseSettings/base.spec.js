const addContext = require('mochawesome/addContext');
const { request, settings, reporter } = require('pactum');
const urls = require('../../data/urls.json');

const awesome_reporter = {
  afterSpec(spec) {
    const mocha_context = spec.recorded.mocha;
    if (spec.status === 'FAILED') {
      addContext(mocha_context, {
        title: 'Request',
        value: spec.request,
      });
      addContext(mocha_context, {
        title: 'Response',
        value: spec.response,
      });
    }
  },
};
// global hook, put pactumJS settings here
before(() => {
  request.setBaseUrl(urls.baseUrl);
  request.setDefaultHeaders({ 'Content-Type': 'application/json' });
  request.setDefaultTimeout(10000);
  settings.setLogLevel(('TRACE'));
  reporter.add(awesome_reporter);
});
