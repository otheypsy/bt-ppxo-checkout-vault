import { useRecoilValue, useSetRecoilState } from "recoil";
import AlertState from "./AlertState";

const useGetAlert = () => {
  const alert = useRecoilValue(AlertState);
  return alert;
};

const useSetAlert = () => {
  const setAlert = useSetRecoilState(AlertState);

  const success = (message) => {
    setAlert({
      message: message,
      type: "success"
    });
  };

  const warning = (message) => {
    setAlert({
      message: message,
      type: "warning"
    });
  };

  const danger = (message) => {
    setAlert({
      message: message,
      type: "danger"
    });
  };

  return { success, warning, danger };
};

export { useGetAlert, useSetAlert };
