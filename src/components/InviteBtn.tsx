import { useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { db, ref, set, serverTimestamp } from "../utils/firebase";
import { Phone, Video, User, X } from "lucide-react";

interface InviteBtnProps {
  zp: any;
  currentUserID: string;
  currentUserName: string;
}

const InviteBtn: React.FC<InviteBtnProps> = ({
  zp,
  currentUserID,
  currentUserName,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [targetID, setTargetID] = useState("");

  const handleCall = async (callType: number) => {
    if (!targetID.trim() || targetID === currentUserID) {
      alert("Enter a valid target user ID (not your own)");
      return;
    }

    try {
      await zp.sendCallInvitation({
        callees: [{ userID: targetID, userName: targetID }],
        callType,
        timeout: 60,
      });

      // Save call info with timestamp
      const callRef = ref(db, `calls/${Date.now()}`);
      await set(callRef, {
        callerID: currentUserID,
        callerName: currentUserName,
        calleeID: targetID,
        callType,
        startedAt: serverTimestamp,
        endedAt: null,
      });

      alert("Call invitation sent");
    } catch (err) {
      console.error("Call error:", err);
      alert("Failed to send call invitation");
    }

    setShowPopup(false);
    setTargetID("");
  };

  return (
    <>
      {/* Start Call Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl py-3 shadow-lg transition-transform active:scale-95 select-none"
        aria-label="Start a call"
      >
        <Phone size={20} />
        Start Call
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="start-call-title"
        >
          <div className="bg-[#111215] max-w-md w-full rounded-3xl border border-zinc-700 shadow-2xl p-8 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
              <h3
                id="start-call-title"
                className="text-xl font-semibold text-white flex items-center gap-3 select-none"
              >
                <User size={24} />
                Start a Call
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                aria-label="Close start call modal"
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            {/* Input Field */}
            <input
              type="text"
              value={targetID}
              onChange={(e) => setTargetID(e.target.value)}
              placeholder="Enter user ID to call"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 text-white placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              autoComplete="off"
              aria-label="User ID to call"
            />

            {/* Call Type Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() =>
                  handleCall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 py-3 text-white font-semibold shadow-md transition-transform active:scale-95 select-none"
                aria-label="Start voice call"
              >
                <Phone size={20} />
                Voice
              </button>
              <button
                onClick={() =>
                  handleCall(ZegoUIKitPrebuilt.InvitationTypeVideoCall)
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-3 text-white font-semibold shadow-md transition-transform active:scale-95 select-none"
                aria-label="Start video call"
              >
                <Video size={20} />
                Video
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-base font-medium transition select-none"
              aria-label="Cancel start call"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteBtn;
