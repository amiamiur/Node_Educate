function checkAuth() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  window.location.href = '/login.html';
}

function getUserId() {
  return localStorage.getItem('userId');
}

const stats = document.getElementById("stats");
const notes_conteiner = document.getElementById("content");
let notes = [];

async function loadNotes() {
  if (!checkAuth()) return;
  
  try {
    const res = await fetch("api/notes", {
      headers: {
        'userid': getUserId()
      }
    });
    notes = await res.json();
    if(notes.length === 0){
      stats.innerText = "У вас нет заметок. Создайте свою первую заметку!\n";
    }
    else{
      stats.innerText = `Всего заметок: ${notes.length}`;
    }
  } catch (error) {
    console.log("Ошибка загрузки заметок:", error);
    stats.innerText = `Ошибка загрузки заметок`;
  }
}

async function addNote() {
  if (!checkAuth()) return;
  
  const title = prompt("Введите название заметки");
  const content = prompt("Введите содержание заметки");
  
  if(!title || !content){
    alert("Заметка не может быть пустой!");
    return;
  }
  
  try {
    await fetch("api/notes", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "userid": getUserId()
      },
      body: JSON.stringify({ title, content }),
    });
    await showNotes();
  } catch (error) {
    console.log("Ошибка добавления заметки:", error.message);
    alert("Ошибка при добавлении заметки");
  }
}

async function showNotes(){
  await loadNotes();
  if(notes.length === 0){
    notes_conteiner.innerHTML = '<h2>📝 Пока у вас нет заметок!</h2><p>Нажмите "Добавить заметку" чтобы создать первую.</p>';
    return;
  }
  
  let html = '<h2>📋 Ваши заметки</h2><div class="notes-list">';
  notes.forEach((note) => {
    html += `
      <div class="note-card" style="background-color: #1a1a1a; color: #0f7946; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0f7946;">
        <small style="color: #888;">[${note.id}] 📅 ${note.date}</small>
        <h4 style="color: #dac227; margin: 10px 0;">${escapeHtml(note.title)}</h4>
        <p>${escapeHtml(note.content)}</p>
      </div>
    `;
  });
  html += '</div>';
  notes_conteiner.innerHTML = html;
}


async function deleteNote(){
  await loadNotes();
  if(notes.length === 0){
    alert("Пока нечего удалять! Заметок нет!");
    return;
  }
  
  let list = notes.map(note => `[${note.id}] ${note.title}`).join('\n');
  const input = prompt(`Введите номер заметки для удаления:\n\n${list}`);
  
  const id_input = parseInt(input);
  if(!id_input || isNaN(id_input)){
    alert("Отмена удаления!");
    return;
  }
  
  const noteToDelete = notes.find(note => note.id === id_input);
  if(noteToDelete){
    if(confirm(`Удалить заметку "${noteToDelete.title}"?`)){
      try {
        const res = await fetch(`/api/notes/${id_input}`, { 
          method: 'DELETE',
          headers: {
            'userid': getUserId()
          }
        });
        if(res.ok){
          await showNotes();
          alert("Заметка удалена!");
        } else {
          alert("Ошибка при удалении заметки");
        }
      } catch (error) {
        console.error("Ошибка удаления:", error);
        alert("Ошибка при удалении заметки");
      }
    }
  } else {
    alert("Заметка с таким номером не найдена!");
  }
}

async function editNote() {
  await loadNotes();
  if(notes.length === 0){
    alert("Пока нечего редактировать! Создайте заметку!");
    return;
  }
  
  let list = notes.map(note => `[${note.id}] ${note.title}`).join('\n');
  const input = prompt(`Введите номер заметки для изменения:\n\n${list}`);
  
  const id_input = parseInt(input);
  if(!id_input || isNaN(id_input)){
    alert("Отмена редактирования!");
    return;
  }
  
  const note = notes.find(note => note.id === id_input);
  if(!note){
    alert("Такой заметки не существует!");
    return;
  }
  
  const title = prompt("Введите новое название:", note.title);
  const content = prompt("Введите новое содержание:", note.content);
  
  if(!title || !content){
    alert("Заметка не может быть пустой!");
    return;
  }
  
  try {
    const res = await fetch(`/api/notes/${id_input}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "userid": getUserId()
      },
      body: JSON.stringify({ title, content }),
    });
    
    if(res.ok){
      await showNotes();
      alert("Заметка обновлена!");
    } else {
      alert("Ошибка при обновлении заметки");
    }
  } catch (error) {
    console.log("Ошибка редактирования:", error.message);
    alert("Ошибка при редактировании заметки");
  }
}

function displayUserInfo() {
  const username = localStorage.getItem('username');
  const userInfoDiv = document.getElementById('userInfo');
  if (userInfoDiv && username) {
    userInfoDiv.innerHTML = `
      <span style="color: #dac227;">👤 ${username}</span>
      <button onclick="logout()" class="btn btn-sm btn-danger" style="margin-left: 10px;">Выйти</button>
    `;
  }
}

if (checkAuth()) {
  loadNotes();
  displayUserInfo();
}

window.addNote = addNote;
window.deleteNote = deleteNote;
window.editNote = editNote;
window.showNotes = showNotes;
window.logout = logout;