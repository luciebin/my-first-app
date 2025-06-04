import React from "react";
import { AdCard } from "./AdCard";

import "../css/lists.css";

export const AdCardsWrapper = ({
  formList,
  selectedFilter,
  searchQuery,
  user,
  editingId,
  setEditingId,
  editedData,
  setEditedData,
  handleEdit,
  handleSaveEdit,
  handleDelete,
  setShowLoginModal,
  replies,
  openReplies,
  setMessage,
  setLoginMessage,
}) => {
  const filteredList = formList.filter((item) => {
    const matchFilter = selectedFilter
      ? item.activity === selectedFilter
      : true;
    const matchSearch = searchQuery
      ? item.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  return (
    <>
      {filteredList.length === 0 ? (
        <p className="notice">Žádné výsledky.</p>
      ) : (
        <div className="cards">
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
              setShowLoginModal={setShowLoginModal}
              replies={replies}
              openReplies={openReplies}
              setMessage={setMessage}
              setLoginMessage={setLoginMessage}
            />
          ))}
        </div>
      )}
    </>
  );
};
