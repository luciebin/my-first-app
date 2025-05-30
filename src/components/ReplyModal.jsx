import React from "react";

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
  const isOwner = user?.uid === adInfo?.uid;

  return (
    <div className="modal" onClick={onClose}>
      <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} title="Zavřít">
          ❌
        </button>
        <h2>{isOwner ? "Odpovědi na tvůj inzerát" : "Napiš odpověď"}</h2>

        {isOwner ? (
          replies.length === 0 ? (
            <p>Žádné odpovědi zatím nepřišly.</p>
          ) : (
            <ul>
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
            <button onClick={() => handleReply(adInfo)} disabled={isReplying}>
              {isReplying ? "Odesílání..." : "Odeslat"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
