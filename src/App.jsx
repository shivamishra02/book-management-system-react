import { useEffect, useState } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "./api/bookApi";

import "./App.css";

function App() {
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [filterGenre, setFilterGenre] = useState("All");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await getBooks();

      setBooks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateBook(editingId, formData);
        setEditingId(null);
      } else {
        await addBook(formData);
      }

      setFormData({
        title: "",
        author: "",
        genre: "",
        year: "",
      });

      fetchBooks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);

    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);

      fetchBooks();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      filterGenre === "All" || book.genre === filterGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container">
      <h1>📚 Book Management System</h1>

      <form className="book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="year"
          placeholder="Publication Year"
          value={formData.year}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or author..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilterGenre(e.target.value)}>
          <option value="All">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="Self Help">Self Help</option>
        </select>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="book-list">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <h2>{book.title}</h2>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Genre:</strong> {book.genre}
              </p>

              <p>
                <strong>Year:</strong> {book.year}
              </p>

              <div className="buttons">
                <button onClick={() => handleEdit(book)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(book.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;