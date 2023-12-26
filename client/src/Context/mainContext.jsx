import { createContext, useState } from "react";

export const MainContext = createContext({});

export default function MainContextProvider(props) {
  const [serverUrl, setServerUrl] = useState();
  return (
    <MainContext.Provider value={{ serverUrl, setServerUrl }}>
      {props.children}
    </MainContext.Provider>
  );
}
