const { spec } = require('pactum');
const { keyValueModel } = require('../data/models/keyValueModel');

async function getRequest() {
  const resp = await spec().get('/')
    .expectStatus(200);
  return resp.body;
}
async function postRequest(body) {
  const resp = await spec().post('/')
    .withBody(body)
    .expectStatus(200);
  return resp.body;
}

async function putRequest(body) {
  const resp = await spec().put('/')
    .withBody(body)
    .expectStatus(200);
  return resp.body;
}

async function deleteRequest(main_key) {
  const resp = await spec().delete('/')
    .withBody({
      main_key,
    })
    .expectStatus(200);
  return resp.body;
}

const clearExistingData = async (data) => {
  const promises = [];
  const mainKeys = [];
  data.forEach((el) => {
    mainKeys.push(el.main_key);
  });

  mainKeys.forEach((key) => {
    promises.push(deleteRequest(key));
  });

  return Promise.all(promises).then((resp) => resp);
};

const bulkAddData = async (num) => {
  const promises = [];

  for (let i = 1; i <= num; i++) {
    // TODO: Swap putRequest function with postRequest once fixed
    promises.push(putRequest(keyValueModel(`main_key${i}`, `value${i}`)));
  }

  return Promise.all(promises).then((resp) => resp);
};

module.exports = {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  clearExistingData,
  bulkAddData,
};
