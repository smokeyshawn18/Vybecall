import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/SignUp";

import { generateToken, initializeZego } from "./utils/zigo";
import SuccessMessage from "./components/Success";

function App() {
  const [userID, setUserID] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [zp, setZp] = useState<any>(null);
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMsgVisible, setSuccessMsgVisible] = useState(false);

  const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
  const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

  useEffect(() => {
    const savedUserID = localStorage.getItem("userID");
    const savedUserName = localStorage.getItem("userName");

    if (savedUserID && savedUserName) {
      const token = generateToken({
        appID,
        serverSecret,
        userID: savedUserID,
        userName: savedUserName,
      });

      const zegoInstance = initializeZego(token);

      setUserID(savedUserID);
      setUserName(savedUserName);
      setZp(zegoInstance);
      setIsSignup(false);
    }
    setLoading(false);
  }, []);

  const handleSignup = () => {
    // No need to save profile here again; already done in Signup component
    setSuccessMsgVisible(true);
  };

  const handleSuccessClose = () => {
    setSuccessMsgVisible(false);
    setIsSignup(false); // switch to login view after success
  };

  const handleLogin = (uid: string, uname: string) => {
    if (!uid || !uname) return alert("Missing user ID or username");

    const token = generateToken({
      appID,
      serverSecret,
      userID: uid,
      userName: uname,
    });

    const zegoInstance = initializeZego(token);

    localStorage.setItem("userID", uid);
    localStorage.setItem("userName", uname);

    setUserID(uid);
    setUserName(uname);
    setZp(zegoInstance);
    setIsSignup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("userName");

    setUserID("");
    setUserName("");
    setZp(null);
    setIsSignup(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (successMsgVisible) {
    return (
      <SuccessMessage
        message="Signup successful! Please login now."
        onClose={handleSuccessClose}
      />
    );
  }

  if (!userID || !userName || !zp) {
    return isSignup ? (
      <Signup
        onSignup={handleSignup}
        switchToLogin={() => setIsSignup(false)}
      />
    ) : (
      <Login onLogin={handleLogin} switchToSignup={() => setIsSignup(true)} />
    );
  }

  return (
    <Dashboard
      userID={userID}
      userName={userName}
      zp={zp}
      onLogout={handleLogout}
    />
  );
}

export default App;
