// list quotes
let quotes = [];

function saveQuotes(){
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes(){
  const saved = localStorage.getItem('quotes');
  if(saved){
    quotes = JSON.parse(saved);
  }
}

function addQuote(){
  // get elements
  const text = document.getElementById('quoteText');
  const author = document.getElementById('quoteAuthor');
  // input get data
  const textInput = text.value;
  const authorInput = author.value;
  // save data
  quotes.push({textInput, authorInput});
  saveQuotes();
  renderQuotes();
}

// show quotes
function renderQuotes(){

  let list = document.getElementById("quotesList");
  let html = "";
  // render cards
  quotes.forEach((quote, index) => {
    html += `
    <div class="quote-card">
      <div class="quote-text"> ${quote.textInput}</div>
      <div class="quote-author"> ${quote.authorInput}</div>
      <button class="delete-btn" data-index="${index}"> Удалить </button>
    </div>
      `;
  });
  list.innerHTML = html;
  // add event delete
  document.querySelectorAll("delete-btn").forEach(btn => { btn.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    quotes.splice(index, 1);
    saveQuotes();
    renderQuotes();
  })});
}

// events
document.getElementById('addBtn').addEventListener('click', addQuote);

// start app
loadQuotes();
renderQuotes();