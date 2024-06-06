import { useRecoilValue, useSetRecoilState } from "recoil";
import ClientInstanceState from "./ClientInstanceState";

const useGetClientInstance = () => {
  const clientInstance = useRecoilValue(ClientInstanceState);
  return clientInstance;
};

const useSetClientInstance = () => {
  const setClientInstance = useSetRecoilState(ClientInstanceState);
  return setClientInstance;
};

export { useGetClientInstance, useSetClientInstance };
