// Работаем с нодой (импорт)
const readline = require("readline");
const helper = require("./utils/helper");
const Decorator = require("./utils/decorator");
const fileManager = require("./utils/fileManager");

//Обращаемся к фреймворку для работы с переменной
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//Работаем с двумя видами кавычек
const NAME_PROJ = '"NOTE"-"BOOK"';
let notes = fileManager.loadFile();
//Функция
const welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

const question = async(query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};




const welcomeApp = async () => {
    Decorator.presentWelcome(welcome);
    await showMenu();
}

const addNote = async () => {
  const title = await question("Введите заголовок  ");
  const content = await question("Напишите текст заметки  ");
  const newNote = {
                id: notes.length + 1,
                title: title,
                content: content,
                date: new Date().toLocaleString(),
            };
            notes.push(newNote);
            console.log(`Заметка ${newNote.title} сохранена!`);
            fileManager.saveFile(notes);
            await showMenu();
}; //Стрелочная функция

const showNotes = async () => {    
    Decorator.showFormatAllNotes(notes);
await showMenu()
};


// Меню программы
const showMenu = async () => {    
    Decorator.presentMenu()
    helper.statsNotes(notes);

    const choice = await question("Выберите пункт от 1 до 4  ");
    try {        
        switch (choice) {
            case '1':
                await addNote();
                break;
            case '2':
                await showNotes();
                break;
            case '3':
                await deleteNote();
            case '4':
                console.log("Завершение программы")
                rl.close();
            default:
                console.log("плаки плаки бурмалдаки");
            await showMenu();
                }
            }
            catch(e){
                console.log("Ошибка! Закрытие приложения!");
                rl.close();
            }
};

const deleteNote = async () => {
    if (notes.length === 0) {
        console.log("У вас пока нет бурмалды");
    }
    notes.forEach((note) => {
    console.log(`\n * [${note.id}] * ${note.title} *`);
    });
    const choice = await question("Введите номер заметки для удаления или 0 для отмены  ");
  
  let num = parseInt(choice);
  
  if (num === 0) {
    await showMenu();
  } else if (num > 0 && num <= notes.length) {
    notes.splice(num - 1, 1);
    notes = helper.reindexId(notes);
    fileManager.saveFile(notes);
    console.log(`Заметка удалена!`);
  } else {
    console.log("Нет подходящей заметки!");
    await showMenu();
  }
 
  await showMenu();
};
//запуск программы
welcomeApp();