import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import BraintreeApp from "./BraintreeApp";

const MainApp = () => {
  return (
    <RecoilRoot>
      <BraintreeApp />
    </RecoilRoot>
  );
};

export default MainApp;
