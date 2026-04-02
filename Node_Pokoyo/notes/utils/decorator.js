class Decorator{
  static drawLine(num , type){
    if(type === 1){
      console.log("=".repeat(num));
    }
    else if(type === 2){
      console.log("-".repeat(num));
    }
    else if(type === 3){
      console.log("_".repeat(num));
    }
    else{
      console.log("~".repeat(num));
    }
    
  }

  static presentWelcome(welcome){
    this.drawLine(50, 1);
    console.log('\n');
    console.log(`${welcome}`);
    this.drawLine(50, 2);
  }

  static presentMenu(){
    this.drawLine(50, 2);
    console.log("Главное меню");
    this.drawLine(50, 2);
    console.log("1. Добавить заметку");
    console.log("2. Посмотреть заметки");
    console.log("3. Удаление заметки");
    console.log("4. Выход");
    this.drawLine(50);
  }
// ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼
  static showFormatNote(note){
      this.drawLine(50);
      console.log(" ┌" + "─".repeat(50));
      console.log(` │ ${note.id} * ${note.date}`);
      console.log(` │ ${note.title}`);
      console.log(` │ ${note.content}`);
      console.log(" └" + "─".repeat(50));
      this.drawLine(50);
  }

  static showFormatAllNotes(notes){
    console.log("----Все ваши заметки----");
    notes.forEach((note) => {
      this.showFormatNote(note);
  });
  }
}
module.exports = Decorator;