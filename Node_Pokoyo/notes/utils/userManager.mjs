import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");

export const loadUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
      return [];
    }
    const jsonData = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.log("Ошибка загрузки пользователей:", error.message);
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    const jsonData = JSON.stringify(users, null, 2);
    fs.writeFileSync(USERS_FILE, jsonData);
  } catch (error) {
    console.log("Ошибка сохранения пользователей:", error.message);
  }
};


export const registerUser = (username, password) => {
  const users = loadUsers();
  
  if (users.find(user => user.username === username)) {
    return { success: false, error: "Пользователь с таким именем уже существует" };
  }
  
  const newUser = {
    id: users.length + 1,
    username: username,
    password: password, 
    createdAt: new Date().toLocaleString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: { id: newUser.id, username: newUser.username } };
};

export const loginUser = (username, password) => {
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    return { success: true, user: { id: user.id, username: user.username } };
  }
  
  return { success: false, error: "Неверное имя пользователя или пароль" };
};