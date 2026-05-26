import axios from "axios";

const API_URL =
  "https://6a151b8691ff9a63de077ca0.mockapi.io/books";

export const getBooks = async () => {
  return await axios.get(API_URL);
};

export const addBook = async (book) => {
  return await axios.post(API_URL, book);
};

export const updateBook = async (id, book) => {
  return await axios.put(`${API_URL}/${id}`, book);
};

export const deleteBook = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};