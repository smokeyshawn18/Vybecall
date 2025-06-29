import { Phone, Video, X } from "lucide-react";

interface Props {
  visible: boolean;
  user: { userID: string; userName: string } | null;
  onClose: () => void;
  onCall: (type: "voice" | "video") => void;
}

const CallPopup: React.FC<Props> = ({ visible, user, onClose, onCall }) => {
  if (!visible || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm shadow-xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X />
        </button>
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">
          Start a call with
        </h3>
        <p className="text-white mb-4 text-xl">{user.userName}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onCall("voice")}
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg flex items-center gap-2"
          >
            <Phone size={18} /> Voice
          </button>
          <button
            onClick={() => onCall("video")}
            className="bg-sky-600 hover:bg-sky-700 px-5 py-3 rounded-lg flex items-center gap-2"
          >
            <Video size={18} /> Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPopup;
