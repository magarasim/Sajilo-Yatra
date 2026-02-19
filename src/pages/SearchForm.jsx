function SearchForm({
  fromValue,
  toValue,
  setFromValue,
  setToValue,
  onSearch,
}) {
  return (
    <div className="page search-page">
      <section className="card">
        <h2>Search route</h2>

        <div className="travel">
          <div className="from">
            <label>
              <input
                type="text"
                placeholder="From"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
              />
            </label>
          </div>

          <div className="to">
            <label>
              <input
                type="text"
                placeholder="To"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
              />
            </label>
          </div>

          <div className="button">
            <button className="primary-btn search-button" onClick={onSearch}>
              Search route
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchForm;