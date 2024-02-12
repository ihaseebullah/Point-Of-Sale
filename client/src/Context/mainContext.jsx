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
  const [connectionIsSecure, setConnectionIsSecure] = useState(false);
  const [modificationDetected, setModificationDetected] = useState(false);
  const [warned, setWarned] = useState(false);
  setTimeout(() => {
    setRefresh(refresh + 1);
  }, 20 * 1000);
  useEffect(() => {
    axios.get("/updateUser").then((res) => {
      if (res.data.statusCode === 4001) {
        axios.get("/logout");
        setUser({});
        setIsLoggedIn(false);
        setConnectionIsSecure(false);
      } else {
        setUser(res.data.user);
      }
    });
    //Url pattern is /authenticateTheConnection/:key,where the key parameter should match the key in response
    axios.get("/authenticateTheConnection/ajshdajshkjh").then((res) => {
      const key = res.data;
      if (res.data.statusCode === 2000) {
        setConnectionIsSecure(
          key.statusCode === 2000
            ? key.key === "ajshdajshkjh"
              ? true
              : false
            : false
        );
        setWarned(false);
      } else if (res.data.statusCode === 3000) {
        setConnectionIsSecure(false);
        setModificationDetected(true);
      } else if (res.data.statusCode === 5000) {
        setConnectionIsSecure(true);
        setWarned(true);
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
        connectionIsSecure,
        warned,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
