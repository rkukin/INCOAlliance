const { spec, handler } = require('pactum');
const { expect } = require('chai');
const {
  getRequest, clearExistingData, bulkAddData,
} = require('../../helpers/requests');
const { postSchema } = require('../../data/jsonSchemas/jsonSchema');
const { keyValueModel } = require('../../data/models/keyValueModel');
const values = require('../../data/values.json');

let _spec = spec();
let response;

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

describe('Tests for POST method', () => {
  before(async () => {
    // Clear all existing data and add data for test
    await clearExistingData(await getRequest());
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
  // TODO: To review tests and check that they work properly swap POST spec handler name to PUT in each test
  //  (_spec.use('POST'... should be _spec.use('PUT'...)

  it('Make a POST request with valid data and make sure that request successful and response schema correct ', async () => {
    await _spec.use('POST', keyValueModel('key', 'val')).expectJsonSchema(postSchema)
      .expectBody(keyValueModel('key', 'val'));
  });

  it('Check that created record returned in GET response', async () => {
    response = await getRequest();
    expect(response).to.have.deep.members([keyValueModel('key', 'val')]);
  });

  it('Make sure that record with duplicated main_key can\'t be added', async () => {
    await _spec.use('POST', keyValueModel('key', 'val')).expectStatus(400)
      .expectBody(values.duplicatedEntityMessage);
  });

  it('Make sure that record with duplicated value can be added', async () => {
    await _spec.use('POST', keyValueModel('key1', 'val')).expectStatus(400)
      .expectBody(keyValueModel('key', 'val'));
  });

  it('Make sure that record with no main_key can\'t be added', async () => {
    await _spec.use('POST', { value: 'val' }).expectStatus(400)
      .expectBody(values.noMainKeyMessage);
  });

  it('Make sure that record with empty main_key can\'t be added', async () => {
    await _spec.use('POST', keyValueModel()).expectStatus(400)
      .expectBody(values.emptyMainKeyMessage);
  });

  it('Make sure that record without value in body can\'t be added', async () => {
    await _spec.use('POST', { main_key: 'key2' }).expectStatus(400)
      .expectBody(values.noValueMessage);
  });

  it('Make sure that record with empty value can be added', async () => {
    await _spec.use('POST', keyValueModel('key2'))
      .expectBody(keyValueModel('key2'));
  });

  it('Make sure that validation works properly when passing value different from string', async () => {
    await _spec.use('POST', keyValueModel('key3', [1, 2, 3])).expectStatus(400)
      .expectBody(values.notSupportedDataTypeMessage);
  });

  it('Make sure that validation works properly when passing value different from string', async () => {
    await _spec.use('POST', keyValueModel(true, 'val4')).expectStatus(400)
      .expectBody(values.notSupportedDataTypeMessage);
  });

  it('Make sure that max 10 records can be added', async () => {
    response = await getRequest();
    await bulkAddData(values.recordsCapacity - response.length);
    await _spec.use('POST', keyValueModel('key100', 'val100')).expectStatus(400)
      .expectBody(values.capReachedMessage);
  });
});
