import { createContext, useState } from "react";

export const MainContext = createContext({});

export default function MainContextProvider(props) {
  const [serverUrl, setServerUrl] = useState();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prevUrl, setPrevUrl] = useState("");
  const [newLogin,setNewLogin]=useState(true)
  return (
    <MainContext.Provider
      value={{
        serverUrl,
        setServerUrl,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        prevUrl,
        setPrevUrl,
        newLogin,
        setNewLogin
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
