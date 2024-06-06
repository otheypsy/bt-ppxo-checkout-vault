import { useEffect, useRef } from "react";
import BTPayPalCheckout from "braintree-web/paypal-checkout";
import { useGetClientInstance } from "../states/ClientInstance/ClientInstanceHooks";
import { useSetAlert } from "../states/Alert/AlertHooks";

const _cart = {
  flow: "checkout",
  amount: "10.0",
  currency: "USD",
  intent: "capture",
  enableShippingAddress: true,
  requestBillingAgreement: true,
  billingAgreementDetails: {
    description:
      "Description of the billng agreement to display to the customer"
  }
};

const BTPwPPCheckoutVault = () => {
  const clientInstance = useGetClientInstance();
  const { success, warning, danger } = useSetAlert();
  const ppContainer = useRef();

  useEffect(() => {
    clientInstance && initialize();
  }, [clientInstance]);

  const initialize = async () => {
    try {
      warning("Initializing BTPwPPCheckoutVault...");
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
      client: clientInstance
    });
    console.log("BTPwPPCheckoutVault: paypalInstance", ppInstance);
    return ppInstance;
  };

  const createPayPal = async (ppInstance) => {
    await ppInstance.loadPayPalSDK({
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
      fundingSource: "paypal",
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
          console.log("BTPwPPCheckoutVault: createOrder", _cart);
          return await ppInstance.createPayment(_cart);
        } catch (error) {
          console.error(error);
          danger("Error!");
        }
      },
      onApprove: async (data) => {
        try {
          console.log("BTPwPPCheckoutVault: onApprove", data);
          warning("Tokenizing approval...");
          const response = await ppInstance.tokenizePayment(data);
          console.log("BTPwPPCheckoutVault: tokenizePayment", response);
          success("Ready!");
        } catch (error) {
          console.error(error);
          danger("Error!");
        }
      },
      onClick: () => console.log("BTPwPPCheckoutVault: onClick"),
      onInit: () => console.log("BTPwPPCheckoutVault: onInit"),
      onCancel: (error) =>
        console.error("BTPwPPCheckoutVault: onCancel", error),
      onError: (error) => console.error("BTPwPPCheckoutVault: onError", error)
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

export default BTPwPPCheckoutVault;
