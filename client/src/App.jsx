import MainContextProvider from "./Context/mainContext";
import Router from "./Router/Router";
import axios from "axios";
function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  return (
    <MainContextProvider>
      <Router />
    </MainContextProvider>
  );
}

export default App;
