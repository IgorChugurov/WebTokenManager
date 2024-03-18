import { useEffect, useState } from "react";
import "./App.css";
import createRequestService from "./services/createRequestService";
import createLoginMessageHandler from "./services/createLoginMessageHandler";
const {
  VITE_PROJECTID: projectid,
  VITE_SSOSERVERURL: ssoserverurl,
  VITE_LSKEY: lskey,
  VITE_AUTHHEADER: authheader,
} = import.meta.env;
const { sendRequest } = createRequestService({
  lskey: lskey,
  authheader: authheader,
});
function App() {
  const [openLoginBlock, setOpenLoginBlock] = useState(false);
  const getProtectData = async () => {
    var req = {
      url: `/api/protected`,
      method: "GET",
    };
    try {
      const res = await sendRequest(req);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Set up the handler with the specified configuration
    const handleLoginMessage = createLoginMessageHandler({
      lskey: lskey,
      ssoserverurl: ssoserverurl,
      callback: (data) => {
        console.log(data);
        setOpenLoginBlock(false);
      },
    });

    // Add the event listener for "userDataFromAuthServer" messages
    window.addEventListener("message", handleLoginMessage, false);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleLoginMessage);
    };
  }, []);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flex: 1 }}>
        <div></div>
        <h1>Auth server + WebTokenManager</h1>
        <div className="card">
          <p>Get tokents from auth server</p>
          <button onClick={() => setOpenLoginBlock(true)}>get token</button>
          <p>
            get <code>protect data </code> use token
          </p>
          <button onClick={() => getProtectData()}>get data</button>
        </div>
      </div>
      {openLoginBlock && (
        <div
          style={{
            flex: 1,
            border: "1px solid",

            width: "100%",
            padding: "32px",
            borderRadius: "6px",

            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <iframe
            src={`${ssoserverurl}/login?projectid=${projectid}`}
            width="90%"
            height="90%"
          />
        </div>
      )}
    </div>
  );
}

export default App;
