import * as fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import { reindexId } from './helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_NAME = path.join(__dirname, "notes.json");

export const loadFile = () => {
  try {
    if (!fs.existsSync(FILE_NAME)) {
      fs.writeFileSync(FILE_NAME, JSON.stringify([]));
      return [];
    }
    const jsonData = fs.readFileSync(FILE_NAME, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.log("Ошибка загрузки заметок:", error.message);
    return [];
  }
};

export const saveFile = (notes) => {
  try {
    const jsonData = JSON.stringify(notes, null, 2);
    fs.writeFileSync(FILE_NAME, jsonData);
  } catch (error) {
    console.log("Ошибка сохранения заметок:", error.message);
  }
};

export const getUserNotes = (userId) => {
  const allNotes = loadFile();
  const userNotes = allNotes.filter(note => note.owner_id === parseInt(userId));
  return reindexId(userNotes);
};

export const createNote = (userId, title, content) => {
  const allNotes = loadFile();
  const userNotes = allNotes.filter(note => note.owner_id === parseInt(userId));
  
  const newNote = {
    id: userNotes.length + 1,
    owner_id: parseInt(userId),
    title: title,
    content: content,
    date: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString()
  };
  
  allNotes.push(newNote);
  saveFile(allNotes);
  
  return { success: true, note: newNote };
};

export const updateNote = (userId, noteId, title, content) => {
  const allNotes = loadFile();
  const noteIndex = allNotes.findIndex(note => 
    note.id === parseInt(noteId) && note.owner_id === parseInt(userId)
  );
  
  if (noteIndex === -1) {
    return { success: false, error: "Заметка не найдена или доступ запрещен" };
  }
  
  allNotes[noteIndex] = {
    ...allNotes[noteIndex],
    title: title,
    content: content,
    updatedAt: new Date().toLocaleString()
  };
  
  saveFile(allNotes);
  return { success: true };
};

export const deleteNote = (userId, noteId) => {
  const allNotes = loadFile();
  const filteredNotes = allNotes.filter(note => 
    !(note.id === parseInt(noteId) && note.owner_id === parseInt(userId))
  );
  
  if (filteredNotes.length === allNotes.length) {
    return { success: false, error: "Заметка не найдена или доступ запрещен" };
  }
  
  // Переиндексация ID для заметок этого пользователя
  const userNotes = filteredNotes.filter(note => note.owner_id === parseInt(userId));
  let userCounter = 1;
  
  const reindexedNotes = filteredNotes.map(note => {
    if (note.owner_id === parseInt(userId)) {
      return { ...note, id: userCounter++ };
    }
    return note;
  });
  
  saveFile(reindexedNotes);
  return { success: true };
};