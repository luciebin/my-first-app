import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { FilterBar } from "./FilterBar";
import { LoginModal } from "./LoginModal";
import { AdCardsWrapper } from "./AdCardsWrapper";
import { ReplyModal } from "./ReplyModal";
import { Button } from "./Button";

import "../css/lists.css";

export const ListOfAd = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formList, setFormList] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReplies, setCurrentReplies] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    age: "",
    date: "",
    message: "",
    activity: "",
  });

  const handleReply = async (info) => {
    if (!replyText.trim() || isReplying) return;

    setIsReplying(true);
    try {
      await addDoc(collection(db, "replies"), {
        adId: info.id,
        toUserId: info.uid,
        fromUserId: user.uid,
        fromEmail: user.email,
        message: replyText.trim(),
        createdAt: serverTimestamp(),
      });

      setReplyText("");
      setMessage("Odpověď byla odeslána.");
    } catch (error) {
      console.error("Chyba při odesílání odpovědi:", error);
      alert("Nepodařilo se odeslat odpověď.");
    } finally {
      setIsReplying(false);
    }
  };

  const myReplies = replies.filter((reply) => reply.toUserId === user?.uid);

  const openReplies = (adInfo) => {
    setSelectedAd(adInfo);
    if (user?.uid !== adInfo.uid) {
      setCurrentReplies([]);
      setShowReplyModal(true);
      return;
    }

    const relevantReplies = replies.filter((reply) => reply.adId === adInfo.id);
    setCurrentReplies(
      relevantReplies.map((reply) => ({
        from: reply.fromEmail,
        text: reply.message,
      }))
    );
    setShowReplyModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedData({
      name: item.name,
      age: item.age,
      date: item.date,
      message: item.message,
      activity: item.activity,
    });
  };

  const handleSaveEdit = async (id) => {
    const currentItem = formList.find((i) => i.id === id);
    if (!currentItem) return;

    if (user?.uid !== currentItem?.uid) {
      alert("Nemáš oprávnění.");
      return;
    }
    if (
      !editedData.name.trim() ||
      !editedData.age.trim() ||
      !editedData.date.trim() ||
      !editedData.activity.trim() ||
      !editedData.message.trim()
    ) {
      alert("Vyplň všechna pole.");
      return;
    }

    try {
      const docRef = doc(db, "formList", id);
      await updateDoc(docRef, editedData);

      setFormList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editedData } : item))
      );
      setEditingId(null);
      setMessage("Změny byly uloženy.");
    } catch (error) {
      console.error("Chyba při ukládání změn:", error);
      alert("Nepodařilo se uložit změny.");
    }
  };

  const handleDelete = async (item) => {
    if (user?.uid !== item.uid) {
      alert("Nemáš oprávnění.");
      return;
    }

    const confirm = window.confirm("Opravdu chceš smazat tento inzerát?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "formList", item.id));
      setFormList((prev) => prev.filter((i) => i.id !== item.id));
      setMessage("Inzerát byl smazán.");
    } catch (error) {
      console.error("Chyba při mazání:", error);
      alert("Nepodařilo se smazat inzerát.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "formList"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormList(data);
      } catch (error) {
        console.error("Chyba při načítání z Firestore:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    if (message && !showLoginModal) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, showLoginModal]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "replies"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReplies(data);
      } catch (err) {
        console.error("Chyba při načítání odpovědí:", err);
      }
    };
    fetchReplies();
  }, []);

  useEffect(() => {
    if (!showLoginModal) setLoginMessage("");
  }, [showLoginModal]);

  return (
    <>
      {showLoginModal && (
        <LoginModal
          setShowLoginModal={setShowLoginModal}
          message={loginMessage}
        />
      )}
      {message && <p className="notice-message">{message}</p>}

      <div className={`lists ${showLoginModal ? "blur" : ""}`}>
        <header className="nav-bar">
          <div className="nav-top-row">
            {user && (
              <div className="user-info">
                <p>
                  Přihlášena jako <strong>{user.email}</strong>
                  {myReplies.length > 0 && (
                    <span
                      className="notif-icon"
                      title="Nové odpovědi"
                      onClick={() => {
                        const userReplies = replies.filter(
                          (reply) => reply.toUserId === user.uid
                        );
                        setSelectedAd({ uid: user.uid });
                        setCurrentReplies(userReplies);
                        setShowReplyModal(true);
                      }}
                    >
                      📩 {myReplies.length}
                    </span>
                  )}
                </p>
                <Button onClick={() => signOut(auth)}>Odhlásit</Button>
              </div>
            )}
            {!user && (
              <>
                <Button onClick={() => setShowLoginModal(true)}>
                  Přihlásit se
                </Button>
              </>
            )}

            <Button
              variant="green"
              onClick={() => {
                if (!user) {
                  setShowLoginModal(true);
                  setLoginMessage(
                    "Pro přidání inzerátu se musíš přihlásit nebo zaergistrovat."
                  );
                  return;
                }
                navigate("/addform");
              }}
            >
              Přidat inzerát
            </Button>
          </div>
          <div className="nav-bottom-row">
            <Button onClick={() => navigate("/")}>Zpět</Button>
            <FilterBar
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </header>
        {message && <p className="notice-message">{message}</p>}
        <AdCardsWrapper
          formList={formList}
          selectedFilter={selectedFilter}
          searchQuery={debouncedSearch}
          user={user}
          editingId={editingId}
          setEditingId={setEditingId}
          editedData={editedData}
          setEditedData={setEditedData}
          handleEdit={handleEdit}
          handleSaveEdit={handleSaveEdit}
          handleDelete={handleDelete}
          setShowLoginModal={setShowLoginModal}
          replies={replies}
          openReplies={openReplies}
          setMessage={setMessage}
          setLoginMessage={setLoginMessage}
        />

        {showReplyModal && (
          <ReplyModal
            replies={currentReplies}
            user={user}
            adInfo={selectedAd}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReply={handleReply}
            isReplying={isReplying}
            onClose={() => setShowReplyModal(false)}
          />
        )}
      </div>
    </>
  );
};
