import { useEffect, useState } from "react";
import UserInfo from "../components/UserInfo";
import InviteBtn from "../components/InviteBtn";
import OnlineUserList from "../components/OnlineUserList";
import CallPopup from "../components/CallPopup";
import StatusBanner from "../components/StatusBanner";
import {
  setUserOnline,
  setUserOffline,
  subscribeOnlineUsers,
} from "../utils/firebase";
import { LogOut, Video } from "lucide-react";
import { getDatabase, ref, get, set, serverTimestamp } from "firebase/database";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface DashboardProps {
  userID: string;
  userName: string;
  zp: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userID,
  userName,
  zp,
  onLogout,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
  const [selectedUser, setSelectedUser] = useState<{
    userID: string;
    userName: string;
  } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setUserOnline(userID, userName);

    const unsubscribe = subscribeOnlineUsers((users) => {
      setOnlineUsers(users);
    });

    // Fetch avatar URL from Firebase Realtime Database
    const fetchAvatar = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userID}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAvatarUrl(data.avatarURL || null);
        }
      } catch (error) {
        console.error("Failed to fetch avatar URL:", error);
      }
    };

    fetchAvatar();

    return () => {
      setUserOffline(userID);
      unsubscribe();
    };
  }, [userID, userName]);

  // Show popup to select call type when user is selected
  const handleUserSelect = (user: { userID: string; userName: string }) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  // Send call invitation using same logic as InviteBtn
  const handleCall = async (type: "voice" | "video") => {
    if (!selectedUser || !zp) return;

    const callType =
      type === "voice"
        ? ZegoUIKitPrebuilt.InvitationTypeVoiceCall
        : ZegoUIKitPrebuilt.InvitationTypeVideoCall;

    if (selectedUser.userID === userID) {
      alert("You cannot call yourself");
      setShowPopup(false);
      return;
    }

    try {
      await zp.sendCallInvitation({
        callees: [
          { userID: selectedUser.userID, userName: selectedUser.userName },
        ],
        callType,
        timeout: 60,
      });

      // Save call info with timestamp in Firebase
      const callRef = ref(getDatabase(), `calls/${Date.now()}`);
      await set(callRef, {
        callerID: userID,
        callerName: userName,
        calleeID: selectedUser.userID,
        callType,
        startedAt: serverTimestamp,
        endedAt: null,
      });

      setStatusMsg(`Calling ${selectedUser.userName} via ${type}...`);
    } catch (err) {
      console.error("Call invitation error:", err);
      setStatusMsg("❌ Failed to send call invitation.");
    }

    setShowPopup(false);
    setTimeout(() => setStatusMsg(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-6 py-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3 text-2xl font-extrabold text-blue-400 select-none">
          <Video size={32} />
          <span>VybeCall</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors duration-200 font-semibold"
          aria-label="Logout"
        >
          <LogOut size={20} />
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl bg-gray-800 bg-opacity-70 rounded-3xl p-8 shadow-lg flex flex-col space-y-8">
        {/* User Information */}
        <section>
          <UserInfo userId={userID} userName={userName} avatarURL={avatarUrl} />
        </section>

        {/* Invite Button */}
        <section className="flex justify-center">
          <InviteBtn
            zp={zp}
            currentUserID={userID}
            currentUserName={userName}
          />
        </section>

        {/* Status Banner */}
        <section>
          <StatusBanner message={statusMsg} />
        </section>

        {/* Online Users List */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-teal-400">
            Online Users
          </h2>
          <OnlineUserList
            onlineUsers={onlineUsers}
            currentUserID={userID}
            onSelectUser={handleUserSelect}
          />
        </section>
      </main>

      {/* Call Popup */}
      <CallPopup
        visible={showPopup}
        user={selectedUser}
        onClose={() => setShowPopup(false)}
        onCall={handleCall}
      />
    </div>
  );
};

export default Dashboard;
