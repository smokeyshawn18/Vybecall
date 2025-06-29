interface Props {
  onlineUsers: Record<
    string,
    { userID: string; userName: string; avatarURL?: string }
  >;
  currentUserID: string;
  onSelectUser: (user: {
    userID: string;
    userName: string;
    avatarURL?: string;
  }) => void;
}

const OnlineUserList: React.FC<Props> = ({
  onlineUsers,
  currentUserID,
  onSelectUser,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg max-h-80 w-full">
      <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
        <span role="img" aria-label="phone">
          📞
        </span>{" "}
        Call Someone
      </h2>

      {Object.keys(onlineUsers).length === 0 ? (
        <p className="text-gray-400 italic text-center py-10 select-none">
          No one is online yet.
        </p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700">
          {Object.values(onlineUsers).map((user) =>
            user.userID === currentUserID ? null : (
              <li
                key={user.userID}
                onClick={() => onSelectUser(user)}
                className="flex justify-between items-center p-3 rounded-lg bg-gray-700 hover:bg-indigo-600 cursor-pointer transition-colors duration-200 shadow-sm"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelectUser(user);
                }}
                aria-label={`Call ${user.userName}`}
              >
                <div className="flex items-center gap-3">
                  {user.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={`${user.userName} avatar`}
                      className="w-10 h-10 rounded-full object-cover select-none"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold uppercase select-none">
                      {user.userName.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-white">
                    {user.userName}
                  </span>
                </div>
                <span className="text-xs text-indigo-300 select-text">
                  {user.userID}
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default OnlineUserList;
