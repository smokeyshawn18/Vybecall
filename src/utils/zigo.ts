import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";

interface TokenArgs {
  appID: number;
  serverSecret: string;
  userID: string;
  userName: string;
}

export const generateToken = ({
  appID,
  serverSecret,
  userID,
  userName,
}: TokenArgs) => {
  if (!userID || !userName) throw new Error("userID and userName required");

  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    "default-room",
    userID,
    userName
  );
};

export const initializeZego = (token: string) => {
  const zp = ZegoUIKitPrebuilt.create(token);
  zp.addPlugins({ ZIM }); // Add ZIM plugin to support invitations
  return zp;
};
