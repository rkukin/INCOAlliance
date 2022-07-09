const { spec, handler } = require('pactum');
const { expect } = require('chai');
const _ = require('lodash');
const {
  getRequest, clearExistingData, bulkAddData,
} = require('../../helpers/requests');
const { postSchema } = require('../../data/jsonSchemas/jsonSchema');
const { keyValueModel } = require('../../data/models/keyValueModel');
const values = require('../../data/values.json');

let _spec = spec();
let response;
let testData;

const numberOfRecords = 2;

handler.addSpecHandler('POST', (ctx) => {
  // eslint-disable-next-line no-shadow
  const { spec, data } = ctx;
  spec.post('/');
  spec.withBody(data);
  spec.expectStatus(200);
});
handler.addSpecHandler('PUT', (ctx) => {
  // eslint-disable-next-line no-shadow
  const { spec, data } = ctx;
  spec.put('/');
  spec.withBody(data);
  spec.expectStatus(200);
});

describe('Tests for PUT method', () => {
  before(async () => {
    // Clear all existing data and add data for test
    await clearExistingData(await getRequest());
    testData = await bulkAddData(numberOfRecords);
    testData = _.sortBy(testData, 'main_key');
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

  // eslint-disable-next-line max-len
  // TODO: To review tests and check that they work properly swap PUT spec handler name to POST in each test
  //  (_spec.use('PUT'... should be _spec.use('POST'...)

  it('Make a PUT request with valid data and make sure that request successful and response schema correct ', async () => {
    await _spec.use('PUT', keyValueModel(testData[0].main_key, 'updatedValue')).expectJsonSchema(postSchema)
      .expectBody(keyValueModel(testData[0].main_key, 'updatedValue'));
  });

  it('Check that updated record returned in GET response with valid data', async () => {
    response = await getRequest();
    expect(response).to.deep.include(keyValueModel(testData[0].main_key, 'updatedValue'));
  });

  it('Make sure that when no main_key in body throw an error', async () => {
    await _spec.use('PUT', { value: 'val' }).expectStatus(400)
      .expectBody(values.noMainKeyMessage);
  });

  it('Make sure that record can\'t be edited with empty main_key', async () => {
    await _spec.use('PUT', keyValueModel()).expectStatus(400)
      .expectBody(values.emptyMainKeyMessage);
  });

  it('Make sure that record can\'t be edited without value in body', async () => {
    await _spec.use('PUT', { main_key: testData[0].main_key }).expectStatus(400)
      .expectBody(values.noValueMessage);
  });

  it('Make sure that record can be edited with empty value', async () => {
    await _spec.use('PUT', keyValueModel(`${testData[0].main_key}`))
      .expectBody(keyValueModel('key1'));
  });

  it('Make sure that when invalid data type of value passed record not edited', async () => {
    await _spec.use('PUT', keyValueModel(`${testData[0].main_key}`, ['one', 'two'])).expectStatus(400)
      .expectBody(values.notSupportedDataTypeMessage);
  });

  it('Make sure that record can\'t be edited with not existing key', async () => {
    await _spec.use('PUT', keyValueModel('k1', 'value')).expectStatus(400)
      .expectBody(values.notExistMessage);
  });
});
