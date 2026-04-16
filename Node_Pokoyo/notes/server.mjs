import * as http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fileManager from './utils/fileManager.mjs';
import * as userManager from './utils/userManager.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, userid');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (url === "/" && method === "GET") {
    const html = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (url === "/app.js" && method === "GET") {
    const js = await fs.readFile(path.join(__dirname, "app.js"), "utf-8");
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js);
    return;
  }

  if (url === "/login.html" && method === "GET") {
    const html = await fs.readFile(path.join(__dirname, "login.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (url === "/api/register" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { username, password } = JSON.parse(body);
      const result = userManager.registerUser(username, password);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  if (url === "/api/login" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { username, password } = JSON.parse(body);
      const result = userManager.loginUser(username, password);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  if (url === "/api/notes" && method === "GET") {
    const userId = req.headers.userid;
    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Не авторизован" }));
      return;
    }
    
    const notes = fileManager.getUserNotes(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }
  if (url === "/api/notes" && method === "POST") {
    const userId = req.headers.userid;
    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Не авторизован" }));
      return;
    }
    
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { title, content } = JSON.parse(body);
      const result = fileManager.createNote(userId, title, content);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  if (url.startsWith("/api/notes/") && method === "DELETE") {
    const userId = req.headers.userid;
    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Не авторизован" }));
      return;
    }
    
    const noteId = parseInt(url.split("/")[3]);
    const result = fileManager.deleteNote(userId, noteId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
    return;
  }

  if (url.startsWith("/api/notes/") && method === "PUT") {
    const userId = req.headers.userid;
    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Не авторизован" }));
      return;
    }
    
    const noteId = parseInt(url.split("/")[3]);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { title, content } = JSON.parse(body);
      const result = fileManager.updateNote(userId, noteId, title, content);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 - Страница не найдена");
});

server.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});