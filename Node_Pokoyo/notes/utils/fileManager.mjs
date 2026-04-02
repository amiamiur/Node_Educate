import * as fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_NAME = path.join(__dirname, "notes.json");


export const saveFile = (notes) => {
  const jsonData = JSON.stringify(notes);
  fs.writeFileSync(FILE_NAME, jsonData);
};

export const loadFile = () => {
  try {
    const jsonData = fs.readFileSync(FILE_NAME, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.log(`${error.message}`);
    console.log("Возникла ошибка", error.message);
    return [];
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

// Обновление заметки (только свои)
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
