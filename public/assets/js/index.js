let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
var currentdate = new Date();
var datetime = (currentdate.getMonth() + 1) + "/"
    + currentdate.getDate() + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes()


if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.titleNotes');
    noteText = document.querySelector('.textareaNotes');
    saveNoteBtn = document.querySelector('.save');
    newNoteBtn = document.querySelector('.new');
    noteList = document.querySelectorAll('.list-container .list-group');
}



let Noteshown = {};

const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });

const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const showNote = () => {
  saveNoteBtn.style.display = 'none'

    if (Noteshown.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = Noteshown.title;
        noteText.value = Noteshown.text;
    } else {
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

const SaveNotes = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
        Datetime: datetime
    };
    saveNote(newNote).then(() => {
        getnShow();
        showNote();
    });
};

// Delete the note
const handleNoteDelete = (e) => {
  
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (Noteshown.id === noteId) {
        Noteshown = {};
    }

    deleteNote(noteId).then(() => {
        getnShow();
        showNote();
    });
};


const handleNoteView = (e) => {
    e.preventDefault();
    Noteshown = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    showNote();
};

const ViewNotes = (e) => {
    Noteshown = {};
    showNote();
};

const ShowSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        saveNoteBtn.style.display = 'none'
    } else {
        saveNoteBtn.style.display = 'inline';
    }
};

const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    const createLi = (title, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = title;
        spanEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'delete-note',
                'float-right',
                'text-danger'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title + " - " +note.Datetime);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};

//shows notes after creation
const getnShow = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', SaveNotes);
    noteTitle.addEventListener('keyup', ShowSaveBtn);
    noteText.addEventListener('keyup', ShowSaveBtn);
    newNoteBtn.addEventListener('click', ViewNotes);
}

getnShow();