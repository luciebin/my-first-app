import React from "react";
import { AdCard } from "./AdCard";

export const AdCardsWrapper = ({
  // obálka, která zpracuje a zobrazí seznam inzerátů
  formList, //seznam všech inzerátů
  selectedFilter, //vybraná kategorie
  searchQuery, // text z vyhledávacího pole
  user, // aktuálně přihlášený uživatel
  editingId, //id inzerátu, který se právě upravuje
  setEditingId, //Funkce na změnu hodnoty editingId
  editedData, //Objekt s právě editovanými daty
  setEditedData, //Funkce na úpravu editedData
  handleEdit, //Funkce, která připraví izerát na úpravu
  handleSaveEdit, //funkce, která uloží upravená data
  handleDelete, //Funkce na smazání inzerátu (z Firebase)
  // handleClick, // zobrazí formulář pro odpověď
  // showReplyId, // ID inzerátu, ke kterému se odpovídá
  // setShowReplyId, // nastaví výše zmíněné ID
  // replyText, // text odpovědi
  // setReplyText, // mění text odpovědi
  // handleReply, // odešle odpověď
  replies, // seznam všech odpovědí
  openReplies, // otevře modal s odpověďmi
  // isReplying, // stav, zda probíhá odesílání
}) => {
  const filteredList = formList.filter((item) => {
    const matchFilter = selectedFilter //filtr kategorie
      ? item.activity === selectedFilter
      : true;
    const matchSearch = searchQuery //hledá podle klíčového slova v kategorii a zprávě
      ? item.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  return (
    <>
      {filteredList.length === 0 ? ( //Pokud nenajde žádný inzerát, vypíše se hláška
        <p>Žádné výsledky.</p>
      ) : (
        //Pokud nějaké inzeráty existují, zobrazí se seznam (ul) a každý z nich jako AdCard.
        <ul className="cards">
          {filteredList.map((info) => (
            <AdCard
              key={info.id}
              info={info}
              user={user}
              editingId={editingId}
              setEditingId={setEditingId}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEdit={handleEdit}
              handleSaveEdit={handleSaveEdit}
              handleDelete={handleDelete}
              // handleClick={handleClick}
              // showReplyId={showReplyId}
              // setShowReplyId={setShowReplyId}
              // replyText={replyText}
              // setReplyText={setReplyText}
              // handleReply={handleReply}
              replies={replies}
              openReplies={openReplies}
              // isReplying={isReplying}
            />
          ))}
        </ul>
      )}
    </>
  );
};
