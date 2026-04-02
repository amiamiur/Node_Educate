const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadFile();

const server = http.createServer(async (req, res) => {
  const { url, method } = req;


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


  if (url === "/api/notes" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  if (url === "/api/notes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      console.log("create start");
      const { title, content } = JSON.parse(body);
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString(),
      };
      console.log("create end");
      notes.push(newNote);
      fileManager.saveFile(notes);
      console.log(`Заметка ${newNote.title} сохранена!`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }
  if(url.startsWith("/api/notes/") && method === 'DELETE'){
      const id = parseInt(url.split('/')[3]);
      notes.splice(id - 1, 1);
      notes = helper.reindexId(notes);
      fileManager.saveFile(notes);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true }));
    }

  if(url.startsWith("/api/notes/") && method === 'PUT'){
      let body = "";
      const id = parseInt(url.split('/')[3]);
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        console.log("edit start");

        const { title, content } = JSON.parse(body);

        notes [id - 1] = {
          ...notes[id - 1],
          title: title,
          content: content,
          date: new Date().toLocaleString(),
        };
        fileManager.saveFile(notes);
        console.log("edit end");
        console.log(`Заметка ${title} изменена!`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
    });
  }
  return;
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту http://localhost:3000");
});