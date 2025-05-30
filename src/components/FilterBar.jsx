import React from "react";

export const FilterBar = ({
  //Komponenta dostává 4 props:
  selectedFilter, // aktuálně vybraný filtr (např. "Sport")
  setSelectedFilter, //funkce, která mění hodnotu filtru
  searchQuery, // aktuální text v hledání
  setSearchQuery, //funkce, která mění text v hledání
}) => {
  return (
    <div className="filters">
      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
      >
        <option value="">Všechny</option>
        <option value="Sport">Sport</option>
        <option value="Umění">Umění</option>
        <option value="Hudební akce">Hudební akce</option>
        <option value="Kurzy">Kurzy</option>
      </select>

      <div className="search-form">
        <label htmlFor="search"></label>
        <input
          type="text"
          id="search"
          placeholder="Hledej"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
