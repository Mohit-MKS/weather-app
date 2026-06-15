interface SavedCitiesProps {
  cities: string[];
  selectedCities: ReadonlySet<string>;
  onSelect: (city: string) => void;
  onDeleteSelected: () => void;
  onOpen: (city: string) => void;
}

const SavedCities = ({
  cities,
  selectedCities,
  onSelect,
  onDeleteSelected,
  onOpen,
}: SavedCitiesProps) => (
  <section className="container py-5" aria-labelledby="saved-heading">
    <div className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between gap-3 mb-4">
      <div>
        <p className="eyebrow eyebrow--dark">Your places</p>
        <h2 className="display-5 fw-bold mb-0" id="saved-heading">Saved cities</h2>
      </div>
      {selectedCities.size > 0 && (
        <button className="btn btn-danger" type="button" onClick={onDeleteSelected}>
          Delete selected ({selectedCities.size})
        </button>
      )}
    </div>

    {cities.length === 0 ? (
      <div className="border border-2 border-secondary border-opacity-25 rounded-4 p-5 text-center bg-white bg-opacity-50">
        <div className="empty-state__icon mx-auto mb-4" aria-hidden="true" />
        <h3 className="h5 fw-bold">No saved cities yet</h3>
        <p className="text-secondary mb-0">Enter a city above and choose "Save city" to keep it close.</p>
      </div>
    ) : (
      <div className="row g-3">
        {cities.map((city, index) => {
          const isSelected = selectedCities.has(city);

          return (
            <div className="col-12 col-md-6 col-lg-4" key={city}>
              <article className={`card h-100 city-card${isSelected ? ' city-card--selected' : ''}`}>
                <input
                  className="form-check-input city-card__checkbox"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(city)}
                  aria-label={`Select ${city}`}
                />
                <button
                  className="btn text-start d-flex flex-column w-100 h-100 p-4 city-card__body"
                  type="button"
                  onClick={() => onOpen(city)}
                >
                  <span className="small text-secondary fw-bold">{String(index + 1).padStart(2, '0')}</span>
                  <span className="city-card__name my-auto">{city}</span>
                  <span className="small text-secondary fw-semibold">
                    View weather <span aria-hidden="true">&rarr;</span>
                  </span>
                </button>
              </article>
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default SavedCities;
