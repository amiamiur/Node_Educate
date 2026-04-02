export const reindexId = (notes) => {
  return notes.map((notes, index) => ({...notes, id:index + 1}));
};

export const statsNotes = (notes) => {
  console.log(`Всего заметок ${notes.length}`);
};