const { GraphQLClient } = require("graphql-request");

const _base64 = {
  encode: (string) => {
    return Buffer.from(string).toString("base64");
  }
};

let _client = null;

const _setup = (credentials) => {
  const endpoint = "https://payments.sandbox.braintree-api.com/graphql";
  _client = new GraphQLClient(endpoint, {
    headers: {
      authorization:
        "Bearer " +
        _base64.encode(credentials.publicKey + ":" + credentials.privateKey),
      "Braintree-Version": "2020-10-01"
    }
  });
};

const _clientToken = (params) => {
  const query = `
        mutation CreateClientTokenRequest($input: CreateClientTokenInput!) {
            createClientToken(input: $input) {
                clientMutationId
                clientToken
            }
        }
    `;
  const variables = {
    input: {
      clientMutationId: Date.now(),
      clientToken: {
        merchantAccountId: params.merchantAccountId,
        ...(!!params.customerId
          ? {
              customerId: params.customerId
            }
          : {})
      }
    }
  };
  return _client.request(query, variables);
};

export default {
  client: _client,
  setup: _setup,
  clientToken: _clientToken
};
