import { useState } from "react";
import BTClient from "braintree-web/client";
import BTDataCollector from "braintree-web/data-collector";
import { useSetClientInstance } from "../states/ClientInstance/ClientInstanceHooks";
import { useSetAlert } from "../states/Alert/AlertHooks";
import BraintreeService from "../services/BraintreeService";

const _mockCredentials = {
  set: (mockCredentials) => {
    window.localStorage.setItem("mockCredentials", mockCredentials);
  },
  get: () => {
    return (
      window.localStorage.getItem("mockCredentials") ||
      JSON.stringify(
        {
          merchantId: "",
          publicKey: "",
          privateKey: "",
          merchantAccountId: ""
        },
        null,
        4
      )
    );
  }
};

const BTClientInstance = () => {
  const setClientInstance = useSetClientInstance();
  const { success, warning, danger } = useSetAlert();
  const [credentialsJSON, setCredentialsJSON] = useState(
    _mockCredentials.get()
  );
  const [merchantId, setMerchantId] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [merchantAccountId, setMerchantAccountId] = useState("");

  const onChange = {
    merchantId: (event) => setMerchantId(event.target.value),
    publicKey: (event) => setPublicKey(event.target.value),
    privateKey: (event) => setPrivateKey(event.target.value),
    merchantAccountId: (event) => setMerchantAccountId(event.target.value),
    credentialsJSON: (event) => setCredentialsJSON(event.target.value)
  };

  const populate = () => {
    try {
      const credentials = JSON.parse(credentialsJSON);
      _mockCredentials.set(credentialsJSON);
      setMerchantId(credentials.merchantId);
      setPublicKey(credentials.publicKey);
      setPrivateKey(credentials.privateKey);
      setMerchantAccountId(credentials.merchantAccountId);
    } catch (error) {
      console.error("Invalid Credentials JSON:", error);
    }
  };

  const initialize = async () => {
    try {
      warning("Initializing BTClientInstance...");
      const clientInstance = await createClientInstance();
      await createDataCollector(clientInstance);
      setClientInstance(clientInstance);
      success("Ready!");
    } catch (error) {
      console.error(error);
      danger("Error!");
    }
  };

  const createClientInstance = async () => {
    BraintreeService.setup({
      merchantId: merchantId,
      publicKey: publicKey,
      privateKey: privateKey
    });
    const tokenResponse = await BraintreeService.clientToken({
      merchantAccountId: merchantAccountId
    });
    console.log("BTClientInstance: clientTokenResponse", tokenResponse);
    const clientInstance = await BTClient.create({
      authorization: tokenResponse.createClientToken.clientToken
    });
    console.log("BTClientInstance: clientInstance", clientInstance);
    return clientInstance;
  };

  const createDataCollector = async (client) => {
    const deviceDataInstance = await BTDataCollector.create({
      client: client,
      paypal: true,
      kount: true
    });
    console.log("BTClientInstance: deviceDataInstance", deviceDataInstance);
  };

  return (
    <>
      <h4 className="p-2">Credentials</h4>
      <br />
      <div className="bg-light p-2">
        <div className="form-group row">
          <label htmlFor="credentialsJSON" className="col-sm-2 col-form-label">
            Credentials JSON
          </label>
          <div className="col-sm-8">
            <textarea
              className="form-control"
              rows="7"
              value={credentialsJSON}
              onChange={onChange.credentialsJSON}
            />
          </div>
          <div className="col-sm-2">
            <button className="btn btn-outline-primary" onClick={populate}>
              Populate
            </button>
          </div>
        </div>
        <br />
        <br />
        <div className="form-group row">
          <label htmlFor="merchantId" className="col-sm-2 col-form-label">
            Merchant Id
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="merchantId"
              value={merchantId}
              onChange={onChange.merchantId}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="publicKey" className="col-sm-2 col-form-label">
            Public Key
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="publicKey"
              value={publicKey}
              onChange={onChange.publicKey}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="privateKey" className="col-sm-2 col-form-label">
            Private Key
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="privateKey"
              value={privateKey}
              onChange={onChange.privateKey}
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="merchantAccountId"
            className="col-sm-2 col-form-label"
          >
            Merchant Account Id
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="merchantAccountId"
              value={merchantAccountId}
              onChange={onChange.merchantAccountId}
            />
          </div>
        </div>
      </div>
      <br />
      <button className="btn btn-outline-primary" onClick={initialize}>
        Initialize Braintree
      </button>
    </>
  );
};

export default BTClientInstance;
