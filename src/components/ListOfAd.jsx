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

import "../css/lists.css";
import { Button } from "./Button";

export const ListOfAd = () => {
  const navigate = useNavigate(); //přesměrování
  const [user, setUser] = useState(null); // přihlášený uživatel
  const [formList, setFormList] = useState([]); // pole všech inzerátů
  const [showLoginModal, setShowLoginModal] = useState(false); // jestli se má ukázat modal
  const [editingId, setEditingId] = useState(null); // id inzerátu, který se upravuje
  const [selectedFilter, setSelectedFilter] = useState(""); // vybraný filtr kategorie
  const [searchQuery, setSearchQuery] = useState(""); // vstup uživatele pro hledání
  const [message, setMessage] = useState(""); // upozornění na akci(smazání, odpověd, edit)
  const [loginMessage, setLoginMessage] = useState(""); //zpráva v modalu
  const [debouncedSearch, setDebouncedSearch] = useState(""); // zpožděný search (kvůli výkonu)
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReplies, setCurrentReplies] = useState([]); // Sem se načtou odpovědi
  const [selectedAd, setSelectedAd] = useState(null); //výběr inzerátu na odpověď
  const [editedData, setEditedData] = useState({
    // data editovaného inzerátu
    name: "",
    age: "",
    date: "",
    message: "",
    activity: "",
  });

  const handleReply = async (info) => {
    // odpověď na inzerát
    if (!replyText.trim() || isReplying) return;

    setIsReplying(true);
    try {
      //vložíš odpověď do kolekce replies ve Firestore. Včetně ID inzerátu a uživatele.
      await addDoc(collection(db, "replies"), {
        adId: info.id, // ke kterému inzerátu odpověď patří
        toUserId: info.uid, // komu je odpověď určena
        fromUserId: user.uid,
        fromEmail: user.email,
        message: replyText.trim(),
        createdAt: serverTimestamp(),
      });

      setReplyText(""); //vymaže stav odpovědi
      setMessage("Odpověď byla odeslána.");
    } catch (error) {
      console.error("Chyba při odesílání odpovědi:", error);
      alert("Nepodařilo se odeslat odpověď.");
    } finally {
      setIsReplying(false);
    }
  };

  // upozornění na zprávu
  const myReplies = replies.filter((reply) => reply.toUserId === user?.uid);

  const openReplies = (adInfo) => {
    setSelectedAd(adInfo);
    // pokud přihlášený uživatel NENÍ autor, otevře se modal s TEXTAREA
    if (user?.uid !== adInfo.uid) {
      setCurrentReplies([]); // nezobrazuj žádné odpovědi
      setShowReplyModal(true);
      return;
    }

    // pokud je to autor, zobrazí odpovědi
    const relevantReplies = replies.filter((reply) => reply.adId === adInfo.id);
    setCurrentReplies(
      relevantReplies.map((reply) => ({
        from: reply.fromEmail,
        text: reply.message,
      }))
    );
    setShowReplyModal(true);
  };

  // const handleClick = (info) => {
  //   //kliknutí na inzerát pro odpověď
  //   if (!user) {
  //     setShowLoginModal(true); //Pokud není přihlášeno → zobrazíš login modal
  //     return;
  //   }
  //   setShowReplyId(info.id); //Jinak nastavíš, na který inzerát se odpovídá
  // };

  const handleEdit = (item) => {
    //připraví inzerát pro úpravu
    setEditingId(item.id);
    setEditedData({
      // načte data inzerátu do editačního formuláře
      name: item.name,
      age: item.age,
      date: item.date,
      message: item.message,
      activity: item.activity,
    });
  };

  const handleSaveEdit = async (id) => {
    //uloží změny
    const currentItem = formList.find((i) => i.id === id);
    if (!currentItem) return;

    if (user?.uid !== currentItem?.uid) {
      // kontroluje, jestli je uživatel vlastník
      alert("Nemáš oprávnění.");
      return;
    }
    if (
      // validuje data (nesmí být prázdné)
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
      //po uložení aktualizuje seznam inzerátů
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

  // smaže inzerát
  const handleDelete = async (item) => {
    if (user?.uid !== item.uid) {
      //kontroluje vlastnictví
      alert("Nemáš oprávnění.");
      return;
    }

    const confirm = window.confirm("Opravdu chceš smazat tento inzerát?"); //potvrzení od uživatele
    if (!confirm) return;

    try {
      //smaže z databáze
      await deleteDoc(doc(db, "formList", item.id));
      setFormList((prev) => prev.filter((i) => i.id !== item.id)); // aktualizuje seznam
      setMessage("Inzerát byl smazán.");
    } catch (error) {
      console.error("Chyba při mazání:", error);
      alert("Nepodařilo se smazat inzerát.");
    }
  };

  // Načtení dat z Firestore
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
        setFormList(data); // uloží do state
      } catch (error) {
        console.error("Chyba při načítání z Firestore:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Uložíme přihlášeného uživatele (nebo null)
    });

    return unsubscribe; // Odhlášení uživatele při unmountu
  }, []);

  useEffect(() => {
    // Debounce vyhledávání
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // čeká 0,5 sekundy

    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    if (message && !showLoginModal) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, showLoginModal]);

  useEffect(() => {
    //odpovědi na inzerát
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
      {/* {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />} */}
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
                {/* {showLoginModal && (
                  <LoginModal setShowLoginModal={setShowLoginModal} />
                )} */}
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
          // handleClick={handleClick}
          // showReplyId={showReplyId}
          // setShowReplyId={setShowReplyId}
          // replyText={replyText}
          // setReplyText={setReplyText}
          // handleReply={handleReply}
          replies={replies}
          openReplies={openReplies}
          // isReplying={isReplying}
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
            // message={message}
          />
        )}
      </div>
    </>
  );
};
