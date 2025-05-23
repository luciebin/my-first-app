import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router";

export const Lists = () => {
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("formList")) || [];
    setFormList(saved);
  }, []);

  return (
    <div>
      <ul>
        {formList.map((info) => (
          <li key={info.id}>
            <p>{info.data.name}</p>
            <p>{info.data.age}</p>
            <p>{info.data.dat}</p>
            <p>{info.data.activity}</p>
            <p>{info.data.message}</p>
          </li>
        ))}
      </ul>

      {/* <!-- <form class="search-form">
    <label for="search">Vyhledej</label>
    <input type="text" id="search" />
  </form> --> */}
    </div>
  );
};
