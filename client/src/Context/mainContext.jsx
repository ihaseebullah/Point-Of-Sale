import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MainContext = createContext({});

export default function MainContextProvider(props) {
  const [serverUrl, setServerUrl] = useState();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prevUrl, setPrevUrl] = useState("");
  const [newLogin, setNewLogin] = useState(true);
  const [refresh, setRefresh] = useState(1);
  setTimeout(() => {
    setRefresh(refresh + 1);
  }, 10 * 1000);
  useEffect(() => {
    axios.get("/updateUser").then((res) => {
      if (res.data.statusCode === 4001) {
        axios.get("/logout");
      } else {
        setUser(res.data.user);
      }
    });
  }, [refresh]);

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
        setNewLogin,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
