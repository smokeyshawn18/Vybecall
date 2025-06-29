import { useState } from "react";
import { Video, User, PlusCircle } from "lucide-react";
import { isUserIDTaken, saveUserProfile } from "../utils/firebase";
import AvatarUpload from "../components/AvatarUpload";

// ImgBB upload helper
async function uploadAvatarToImgBB(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) throw new Error("ImgBB API key not found");

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });

  const formData = new FormData();
  formData.append("image", await toBase64(file));
  formData.append("name", file.name);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("ImgBB upload failed");
  }
}

interface SignupProps {
  onSignup: (userID: string, userName: string) => void;
  switchToLogin: () => void;
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

const Signup: React.FC<SignupProps> = ({ onSignup, switchToLogin }) => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const trimmedUserID = userID.trim();
      const trimmedUserName = userName.trim();

      const taken = await isUserIDTaken(trimmedUserID);
      console.log("🔍 Is user ID taken:", taken);

      if (taken) {
        showPopup(
          "User ID Taken",
          "This User ID is already taken. Please choose a different one."
        );
        setLoading(false);
        return;
      }

      // Upload avatar
      let avatarURL: string | undefined = undefined;
      if (avatarFile) {
        avatarURL = await uploadAvatarToImgBB(avatarFile);
        console.log("✅ Uploaded Avatar URL:", avatarURL);
      } else {
        console.log("⚠️ No avatar selected");
      }

      console.log("📦 Saving user profile with data:", {
        userID: trimmedUserID,
        userName: trimmedUserName,
        avatarURL,
      });

      await saveUserProfile(trimmedUserID, trimmedUserName, avatarURL);

      console.log("✅ Profile saved");

      onSignup(trimmedUserID, trimmedUserName);
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      showPopup("Signup Error", error.message || "Something went wrong.");
    }
    setLoading(false);
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
            Join VybeCall today and start vibing with your friends instantly!
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 max-w-xl bg-white bg-opacity-80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl flex flex-col space-y-8"
      >
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-4xl font-extrabold text-teal-700 tracking-tight">
            Create an Account
          </h2>
          <span className="text-lg text-zinc-700 mt-2">
            Sign up to start your VybeCall journey
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
            placeholder="Choose a unique user ID"
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
            <PlusCircle size={24} className="text-teal-600" /> Username
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your display name"
            className="w-full px-5 py-3 bg-white bg-opacity-70 rounded-xl border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-base shadow focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            autoComplete="off"
          />
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-zinc-700">
            Upload Avatar (optional)
          </label>
          <AvatarUpload onFileSelect={setAvatarFile} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 py-4 rounded-xl font-extrabold text-2xl text-white shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Switch to Login */}
        <p className="text-center text-base text-zinc-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-teal-600 hover:underline font-semibold"
          >
            Login
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

export default Signup;
