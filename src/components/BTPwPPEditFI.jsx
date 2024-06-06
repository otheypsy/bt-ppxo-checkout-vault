import { useEffect, useRef } from "react";
import BTPayPalCheckout from "braintree-web/paypal-checkout";
import { useGetClientInstance } from "../states/ClientInstance/ClientInstanceHooks";
import { useSetAlert } from "../states/Alert/AlertHooks";

const _cart = {
  flow: "checkout",
  amount: "10.0",
  currency: "USD",
  intent: "capture"
};

const BTPwPPEditFI = () => {
  const clientInstance = useGetClientInstance();
  const { success, warning, danger } = useSetAlert();
  const ppContainer = useRef();

  useEffect(() => {
    clientInstance && initialize();
  }, [clientInstance]);

  const initialize = async () => {
    try {
      warning("Initializing BTPwPPEditFI...");
      const ppInstance = await createPayPalInstance();
      await createPayPal(ppInstance);
      success("Ready!");
    } catch (error) {
      console.error(error);
      danger("Error!");
    }
  };

  const createPayPalInstance = async () => {
    const ppInstance = await BTPayPalCheckout.create({
      client: clientInstance,
      autoSetDataUserIdToken: true
    });
    console.log("BTPwPPEditFI: paypalInstance", ppInstance);
    return ppInstance;
  };

  const createPayPal = async (ppInstance) => {
    await ppInstance.loadPayPalSDK({
      "disable-funding": "card",
      "enable-funding": "venmo",
      currency: _cart.currency,
      intent: _cart.intent,
      commit: false
    });
    if (!window.hasOwnProperty("paypal"))
      throw Error("PayPal JS SDK not found");
    const ppConfig = createPPConfig(ppInstance);
    window.paypal.Buttons(ppConfig).render(ppContainer.current);
  };

  const createPPConfig = (ppInstance) => {
    return {
      // fundingSource: "paypal",
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
        tagline: false
      },
      createOrder: async () => {
        try {
          warning("Redirecting to PayPal for approval...");
          console.log(ppInstance);
          console.log("BTPwPPEditFI: createOrder", _cart);
          return await ppInstance.createPayment(_cart);
        } catch (error) {
          console.error(error);
          danger("Error!");
        }
      },
      onApprove: async (data) => {
        try {
          console.log("BTPwPPEditFI: onApprove", data);
          warning("Tokenizing approval...");
          const response = await ppInstance.tokenizePayment(data);
          console.log("BTPwPPEditFI: tokenizePayment", response);
          success("Ready!");
        } catch (error) {
          console.error(error);
          danger("Error!");
        }
      },
      onClick: () => console.log("BTPwPPEditFI: onClick"),
      onInit: () => console.log("BTPwPPEditFI: onInit"),
      onCancel: (error) => console.error("BTPwPPEditFI: onCancel", error),
      onError: (error) => console.error("BTPwPPEditFI: onError", error)
    };
  };

  return (
    <div className="row">
      <div className="col">
        <h4 className="p-2">Checkout + Vault</h4>
        <br />
        <pre className="bg-light p-2">
          <code>{JSON.stringify(_cart, null, 2)}</code>
        </pre>
        <br />
        <div className="row">
          <div className="col-4">
            <div ref={ppContainer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BTPwPPEditFI;
