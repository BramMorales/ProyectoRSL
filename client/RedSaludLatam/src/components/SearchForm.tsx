// src/components/SearchForm.tsx
import React from "react";

const SearchForm: React.FC = () => {
  return (
    <div className="search-container">
      <span>
        <label htmlFor="search-what">Buscar</label>
      </span>
      <span>
        <input
          id="search-what"
          type="text"
          className="search-input"
          placeholder="Ej. Dentistas, cardiólogos..."
        />
      </span>

      <span>
        <label htmlFor="search-where">¿Dónde?</label>
      </span>
      <span>
        <input
          id="search-where"
          type="text"
          className="search-input"
          placeholder="Tu ciudad"
        />
      </span>

      <button type="button" className="search-btn">
        Buscar
      </button>
    </div>
  );
};

export default SearchForm;
