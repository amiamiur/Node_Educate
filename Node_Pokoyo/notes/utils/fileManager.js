const fs = require("fs");
const path = "notes.json";

const saveFile = (notes) => {
  const jsonData = JSON.stringify(notes);
  fs.writeFileSync(path, jsonData);
};

const loadFile = () => {
  try {
    const jsonData = fs.readFileSync(path, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.log(`${error.message}`);
    console.log("Возникла ошибка", error.message);
    return [];
  }
};

module.exports = { saveFile, loadFile };