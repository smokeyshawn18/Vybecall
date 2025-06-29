import { useState } from "react";
import { Video, User, Key } from "lucide-react";
import { checkUserExists } from "../utils/firebase";

interface LoginProps {
  onLogin: (userID: string, userName: string) => void;
  switchToSignup: () => void;
}

interface PopupProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ visible, title, message, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full border border-zinc-700 shadow-lg text-white">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-teal-600 hover:bg-teal-700 rounded-lg px-6 py-3 font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin, switchToSignup }) => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");

  // Popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = (title: string, message: string) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userID.trim() || !userName.trim()) {
      showPopup("Missing Fields", "Please enter both User ID and Username.");
      return;
    }

    const exists = await checkUserExists(userID.trim(), userName.trim());

    if (!exists) {
      showPopup(
        "User Not Found",
        "The User ID or Username you entered does not exist. Please contact admin or sign up first."
      );
      return;
    }

    // User exists, proceed
    onLogin(userID.trim(), userName.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#00c6fb] px-0">
      {/* Left Side: Welcome Panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 h-full bg-opacity-30 backdrop-blur-lg rounded-r-3xl shadow-2xl p-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white bg-opacity-20 p-6 rounded-full shadow-xl border-2 border-teal-400 animate-spin-slow">
            <Video size={56} className="text-teal-400 drop-shadow-lg" />
          </div>
          <h1 className="text-6xl font-black text-white drop-shadow-lg tracking-tight">
            VybeCall
          </h1>
          <p className="text-2xl text-teal-100 font-medium text-center max-w-xs">
            Connect, chat, and vibe with friends—anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 max-w-xl bg-white bg-opacity-80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl flex flex-col space-y-10"
      >
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-4xl font-extrabold text-teal-700 tracking-tight">
            Welcome Back!
          </h2>
          <span className="text-lg text-zinc-700 mt-2">
            Sign in to continue
          </span>
        </div>

        {/* User ID */}
        <div>
          <label
            htmlFor="userID"
            className="flex items-center gap-3 text-lg font-semibold text-zinc-700 mb-2"
          >
            <User size={24} className="text-teal-600" /> User ID
          </label>
          <input
            id="userID"
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="Enter your user ID"
            className="w-full px-5 py-3 bg-white bg-opacity-70 rounded-xl border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-base shadow focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            autoComplete="off"
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="userName"
            className="flex items-center gap-3 text-lg font-semibold text-zinc-700 mb-2"
          >
            <Key size={24} className="text-teal-600" /> Username
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-5 py-3 bg-white bg-opacity-70 rounded-xl border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-base shadow focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            autoComplete="off"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 py-4 rounded-xl font-extrabold text-2xl text-white shadow-lg transition"
        >
          Login
        </button>

        {/* Switch to Signup */}
        <p className="text-center text-base text-zinc-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={switchToSignup}
            className="text-teal-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
      </form>

      {/* Popup */}
      <Popup
        visible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </div>
  );
};

export default Login;
