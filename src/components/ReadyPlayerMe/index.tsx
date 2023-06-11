import React, { useEffect, useRef } from "react";
import { parse } from "@/utils";
import { Modal } from "antd";

type Props = {
  showIFrame: boolean;
  setShowIFrame: (showIFrame: boolean) => void;
  setModel: (model: any) => void;
};

const ReadyPlayerMe = ({ showIFrame, setShowIFrame, setModel }: Props) => {
  const subdomain = process.env.READY_PLAYER_ME_SUBDOMAIN;
  const iFrameRef = useRef(null);

  useEffect(() => {
    let iFrame: any = iFrameRef.current;
    if (iFrame) {
      iFrame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi=true&clearCache=true`;
    }
  });

  useEffect(() => {
    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);

    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe);
    };
  });

  const subscribe = event => {
    const json = parse(event.data);
    if (json?.source !== "readyplayerme") {
      return;
    }

    // Subscribe to all events sent from Ready Player Me once frame is ready
    if (json.eventName === "v1.frame.ready") {
      let iFrame: any = iFrameRef.current;
      if (iFrame && iFrame.contentWindow) {
        iFrame.contentWindow.postMessage(
          JSON.stringify({
            target: "readyplayerme",
            type: "subscribe",
            eventName: "v1.**"
          }),
          "*"
        );
      }
    }

    // Get avatar GLB URL
    if (json.eventName === "v1.avatar.exported") {
      setShowIFrame(false);
      setModel(json.data.url);
    }
  };

  return (
    <Modal
      title="Đổi Mô hình 3D Avatar"
      open={showIFrame}
      footer={null}
      onCancel={() => setShowIFrame(false)}
      width={1000}
      centered
    >
      <iframe
        allow="camera *; microphone *"
        className="iFrame"
        id="frame"
        ref={iFrameRef}
        title={"Ready Player Me"}
        style={{
          width: "100%",
          height: "600px"
        }}
      />
    </Modal>
  );
};

export default ReadyPlayerMe;
