import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://api.thecatapi.com/v1/images/search";

function App() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  async function loadCat() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Ошибка запроса: " + response.status);
      }

      const data = await response.json();
      setCat(data[0]);
    } catch (err) {
      setError("Не удалось загрузить кота. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCat();
  }, []);

  const isFavorite = cat && favorites.some((item) => item.id === cat.id);

  function addToFavorites() {
    if (!cat || isFavorite) return;
    setFavorites([...favorites, cat]);
  }

  function removeFromFavorites(id) {
    setFavorites(favorites.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <h1>Random Cat</h1>

      <div className="photo">
        {loading && <p>Загрузка...</p>}
        {!loading && error && <p className="error">{error}</p>}
        {!loading && !error && cat && <img src={cat.url} alt="Случайный кот" />}
      </div>

      <div className="buttons">
        <button onClick={loadCat} disabled={loading}>
          Новый кот
        </button>
        <button
          onClick={addToFavorites}
          disabled={loading || !cat || isFavorite || !!error}
        >
          {isFavorite ? "В избранном" : "Добавить в избранное"}
        </button>
      </div>

      <h2>Избранные коты ({favorites.length})</h2>

      {favorites.length === 0 ? (
        <p className="empty">Пока никого нет</p>
      ) : (
        <div className="favorites">
          {favorites.map((item) => (
            <div className="favorite" key={item.id}>
              <img src={item.url} alt="Избранный кот" />
              <button onClick={() => removeFromFavorites(item.id)}>
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
