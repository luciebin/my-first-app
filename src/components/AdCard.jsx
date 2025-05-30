import "../css/adCard.css";

export const AdCard = ({
  //prijímá data a funkce jako props, zobrazuje jeden inzerát.
  user, //přihlášený uživatel
  info, // jednotlivý inzerát s daty (z pole formList). Obsahuje všechna data, která se zobrazují
  editingId, //id inzerátu, který se právě upravuje
  setEditingId, //Funkce na změnu hodnoty editingId
  editedData, //Objekt, který drží aktuálně upravovaná data inzerátu
  setEditedData, //Funkce, která mění editedData
  handleEdit, //Funkce, která nastaví editingId na info.id a předvyplní editedData podle info
  handleSaveEdit, //funkce, která uloží upravená data do Firebase a ukončí editační režim
  handleDelete, //Funkce na smazání inzerátu (z Firebase)
  setShowLoginModal,
  // handleClick,
  // showReplyId,
  // replyText,
  // setReplyText,
  // handleReply,
  replies,
  openReplies,
  // isReplying,
}) => {
  return (
    <li
      className="card"
      onClick={() => {
        if (typeof setShowLoginModal === "function" && !user) {
          setShowLoginModal(true);
          return;
        }
        if (user && user.uid !== info.uid) {
          openReplies(info);
        }
      }}
    >
      {editingId === info.id ? ( // pokud editingId odpovídá info.id, zobrazí se editační formulář
        <div className="card-edit">
          {/* Editační formulář */}
          <input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <input
            value={editedData.age}
            onChange={(e) =>
              setEditedData({ ...editedData, age: e.target.value })
            }
          />
          <input
            type="date"
            value={editedData.date}
            onChange={(e) =>
              setEditedData({ ...editedData, date: e.target.value })
            }
          />
          <input
            value={editedData.activity}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                activity: e.target.value,
              })
            }
          />
          <textarea
            value={editedData.message}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                message: e.target.value,
              })
            }
          />
          <div className="card-buttons">
            <button
              className="card-btn"
              onClick={() => handleSaveEdit(info.id)}
            >
              Uložit
            </button>
            <button className="card-btn" onClick={() => setEditingId(null)}>
              Zrušit
            </button>
          </div>
        </div>
      ) : (
        // Pokud nejsme v režimu úprav, vykreslí se inzerát jako text
        <div className="card-info">
          <p>{info.date}</p>
          <p>
            {info.name}, {info.age}
          </p>
          <p>{info.activity}</p>
          <p>{info.message}</p>
          {/*
          {user && user.uid !== info.uid && (
            <>
              <span
                className="reply-icon"
                onClick={(e) => {
                  e.stopPropagation(); // zabrání kliknutí na celou kartu
                  handleClick(info);
                }}
                title="Odpovědět"
              >
                💬 {/* nebo použij nějakou svg/ikonu z knihovny */}
          {/* </span>
              {/* formulář pro odpověď*/}
          {/* {showReplyId === info.id && (
                <div className="reply-form">
                  <textarea
                    placeholder="Napiš svou odpověď..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    onClick={() => handleReply(info)}
                    disabled={isReplying}
                  >
                    {isReplying ? "Odesílání..." : "Odeslat"}{" "}
                    {/*zabrání vícenásobnému odeslání */}
          {/* </button>
                </div>
              )}
            </>
          )}

          {/* Seznam odpovědí (jen pro autora inzerátu)*/}
          {/* {user?.uid === info.uid && (
            <div className="reply-list">
              <h4>Odpovědi:</h4>
              {replies
                .filter((reply) => reply.adId === info.id)
                .map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <p>
                      <strong>{reply.fromEmail}:</strong> {reply.message}
                    </p>
                  </div>
                ))}
            </div>
          )} */}
          {/* 
          {user && user.uid !== info.uid && (
            <button onClick={() => openReplies(info)}>Odpovědět</button>
          )} */}

          {user?.uid === info.uid && ( // Pokud přihlášený uživatel je autorem inzerátu, ukážou se tlačítka
            <div className="card-buttons">
              <button className="card-btn" onClick={() => handleEdit(info)}>
                Upravit
              </button>{" "}
              {/*
              přepne do editačního režimu*/}
              <button className="card-btn" onClick={() => handleDelete(info)}>
                Smazat
              </button>{" "}
              {/*smaže
              inzerát*/}
            </div>
          )}
        </div>
      )}
    </li>
  );
};
