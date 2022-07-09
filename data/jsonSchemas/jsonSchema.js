const getSchema = {
  type: 'array',
  maxItems: 10,
  items: {
    required: ['value', 'main_key'],
    type: 'object',
    properties: {
      value: {
        type: 'string',
      },
      main_key: {
        type: 'string',
      },
    },
  },
};

const postSchema = {
  required: ['value', 'main_key'],
  type: 'object',
  properties: {
    value: {
      type: 'string',
    },
    main_key: {
      type: 'string',
    },
  },
};

const deleteSchema = {
  required: ['main_key'],
  type: 'object',
  properties: {
    main_key: {
      type: 'string',
    },
  },
};

module.exports = {
  getSchema,
  postSchema,
  deleteSchema,
};
