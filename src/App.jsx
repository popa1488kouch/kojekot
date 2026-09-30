import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/characters/";
const CLASSES = ["Воин", "Маг", "Лучник", "Разбойник"];
const WEAPONS = ["Меч", "Посох", "Лук", "Кинжал"];

const emptyForm = {
  name: "",
  character_class: "Воин",
  level: "1",
  weapon: "Меч",
  description: "",
};

function validate(form) {
  const errors = {};

  if (form.name.trim().length < 3) {
    errors.name = "Имя должно быть не короче 3 символов";
  }

  const level = Number(form.level);
  if (form.level === "" || !Number.isInteger(level) || level < 1 || level > 100) {
    errors.level = "Уровень должен быть от 1 до 100";
  }

  if (form.description.trim() === "") {
    errors.description = "Описание не должно быть пустым";
  }

  return errors;
}

function App() {
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [character, setCharacter] = useState(null);

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (hasErrors) return;

    setLoading(true);
    setServerError("");
    setCharacter(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          character_class: form.character_class,
          level: Number(form.level),
          weapon: form.weapon,
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(Object.values(data).flat().join(" "));
        return;
      }

      setCharacter(data);
      setForm(emptyForm);
      setTouched({});
    } catch (err) {
      setServerError("Не удалось связаться с сервером");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Создай своего персонажа</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Имя персонажа
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        {touched.name && errors.name && <p className="error">{errors.name}</p>}

        <label>
          Класс
          <select
            name="character_class"
            value={form.character_class}
            onChange={handleChange}
          >
            {CLASSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Уровень
          <input
            type="number"
            name="level"
            value={form.level}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        {touched.level && errors.level && (
          <p className="error">{errors.level}</p>
        )}

        <label>
          Оружие
          <select name="weapon" value={form.weapon} onChange={handleChange}>
            {WEAPONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Описание
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        {touched.description && errors.description && (
          <p className="error">{errors.description}</p>
        )}

        <button type="submit" disabled={hasErrors || loading}>
          {loading ? "Создание..." : "Создать персонажа"}
        </button>
      </form>

      {serverError && <p className="error">{serverError}</p>}

      {character && (
        <div className="card">
          <h2>{character.name.toUpperCase()}</h2>
          <p>Класс: {character.character_class}</p>
          <p>Уровень: {character.level}</p>
          <p>Оружие: {character.weapon}</p>
          <p>{character.description}</p>
          <p className="success">Персонаж создан</p>
        </div>
      )}
    </div>
  );
}

export default App;
