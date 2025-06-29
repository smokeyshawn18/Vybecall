import React from "react";

interface UserInfoProps {
  userId: string;
  userName: string;
  avatarURL?: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId, userName, avatarURL }) => {
  // Remove accidental quotes from stored URL
  const cleanAvatarUrl = avatarURL?.replace(/^['"]+|['"]+$/g, "") || null;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-xl shadow">
      {cleanAvatarUrl ? (
        <img
          src={cleanAvatarUrl}
          alt={`${userName}'s avatar`}
          title={userName}
          className="w-16 h-16 rounded-full object-cover border-2 border-teal-400"
          onError={handleImgError}
        />
      ) : (
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl uppercase">
          {userName.charAt(0)}
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-xl font-bold text-white">{userName}</span>
        <span className="text-sm text-zinc-400">{userId}</span>
      </div>
    </div>
  );
};

export default UserInfo;
