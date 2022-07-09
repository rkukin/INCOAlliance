const { spec, handler } = require('pactum');
const { expect } = require('chai');
const _ = require('lodash');
const {
  getRequest, clearExistingData, bulkAddData,
} = require('../../helpers/requests');
const { getSchema } = require('../../data/jsonSchemas/jsonSchema');
const { recordsCapacity } = require('../../data/values.json')

const numOfRecords = recordsCapacity;
let testData;
let _spec = spec();
let response;

handler.addSpecHandler('GET', (ctx) => {
  // eslint-disable-next-line no-shadow
  const { spec } = ctx;
  spec.get('/');
  spec.expectStatus(200);
});

describe('Tests for GET method', () => {
  before(async () => {
    // Clear all existing data and add data for test
    await clearExistingData(await getRequest());
    testData = await bulkAddData(numOfRecords);
  });

  // eslint-disable-next-line func-names
  beforeEach(function () {
    _spec = spec();
    _spec.records('mocha', this);
  });

  after(async () => {
    // Clear data after test
    await clearExistingData(await getRequest());
  });

  it('Make a GET request and check response schema', async () => {
    response = await _spec.use('GET').expectJsonSchema(getSchema);
  });

  it('Check that valid data from before() returned in response', () => {
    expect(_.sortBy(response.body, 'main_key')).to.deep.equal(_.sortBy(testData, 'main_key'));
  });
});
