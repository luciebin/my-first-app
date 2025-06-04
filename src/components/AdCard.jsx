import "../css/adCard.css";
import { Button } from "./Button";

export const AdCard = ({
  user,
  info,
  editingId,
  setEditingId,
  editedData,
  setEditedData,
  handleEdit,
  handleSaveEdit,
  handleDelete,
  setShowLoginModal,
  openReplies,
  setLoginMessage,
}) => {
  return (
    <div
      className="card"
      onClick={() => {
        if (typeof setShowLoginModal === "function" && !user) {
          setShowLoginModal(true);
          setLoginMessage("Pro odpověď se musíš přihlásit nebo zaregistrovat.");
          return;
        }
        if (user && user.uid !== info.uid) {
          openReplies(info);
        }
      }}
    >
      {editingId === info.id ? (
        <div className="card-edit">
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
            <Button variant="small" onClick={() => handleSaveEdit(info.id)}>
              Uložit
            </Button>
            <Button variant="small" onClick={() => setEditingId(null)}>
              Zrušit
            </Button>
          </div>
        </div>
      ) : (
        <div className="card-info">
          <p>{info.date}</p>
          <p>
            {info.name}, {info.age}
          </p>
          <p>{info.activity}</p>
          <p>{info.message}</p>
          {user?.uid === info.uid && (
            <div className="card-buttons">
              <Button variant="small" onClick={() => handleEdit(info)}>
                Upravit
              </Button>
              <Button variant="small" onClick={() => handleDelete(info)}>
                Smazat
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
