import React from "react";
import "../css/replyModal.css";
import { Button } from "./Button";

export const ReplyModal = ({
  replies,
  onClose,
  user,
  adInfo,
  replyText,
  setReplyText,
  handleReply,
  isReplying,
}) => {
  const isOwner = !adInfo || user?.uid === adInfo?.uid;

  return (
    <div className="modal" onClick={onClose}>
      <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
        <Button variant="close" onClick={onClose} title="Zavřít">
          &times;
        </Button>
        <h2>{isOwner ? "Odpovědi na tvůj inzerát" : "Napiš odpověď"}</h2>
        <div className="show-reply-form">
          {isOwner ? (
            replies.length === 0 ? (
              <p>Žádné odpovědi zatím nepřišly.</p>
            ) : (
              <ul className="replies">
                {replies.map((reply) => (
                  <li key={reply.id}>
                    <p>
                      <strong>{reply.fromEmail}</strong>
                    </p>
                    <p>{reply.message}</p>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="reply-form">
              <textarea
                placeholder="Napiš svou odpověď..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button onClick={() => handleReply(adInfo)} disabled={isReplying}>
                {isReplying ? "Odesílání..." : "Odeslat"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
