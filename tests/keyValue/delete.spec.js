const { spec, handler } = require('pactum');
const { expect } = require('chai');
const {
  getRequest, clearExistingData, bulkAddData,
} = require('../../helpers/requests');
const { deleteSchema } = require('../../data/jsonSchemas/jsonSchema');
const { keyValueModel } = require('../../data/models/keyValueModel');
const values = require('../../data/values.json');

let _spec = spec();
let response;
const numOfRecords = 7;
let testData;

handler.addSpecHandler('DELETE', (ctx) => {
  // eslint-disable-next-line no-shadow
  const { spec, data } = ctx;
  spec.delete('/');
  spec.withBody(data);
  spec.expectStatus(200);
});

describe('Tests for DELETE method', () => {
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

  it('Make a DELETE request with valid data and make sure that request successful and response schema correct ', async () => {
    await _spec.use('DELETE', { main_key: testData[0].main_key }).expectJsonSchema(deleteSchema)
      .expectBody({ main_key: testData[0].main_key });
  });

  it('Check that deleted record not returned in GET response', async () => {
    response = await getRequest();
    expect(response).not.deep.include([keyValueModel(testData[0].main_key, testData[0].value)]);
  });

  it('Make sure that validation error returned when no main_key in request', async () => {
    await _spec.use('DELETE', {}).expectStatus(400)
      .expectBody(values.noMainKeyMessage);
  });

  it('Make sure that validation error returned when main_key has empty value in request', async () => {
    await _spec.use('DELETE', { main_key: '' }).expectStatus(400)
      .expectBody(values.emptyMainKeyMessage);
  });

  it('Make sure that record with empty value can be added', async () => {
    await _spec.use('DELETE', { main_key: '1987' }).expectStatus(400)
      .expectBody(values.emptyMainKeyMessage).inspect();
  });

  it('Make sure that validation works properly when passing main_key value different from string', async () => {
    await _spec.use('DELETE', { main_key: ['one'] }).expectStatus(400)
      .expectBody(values.notSupportedDataTypeMessage);
  });
});
