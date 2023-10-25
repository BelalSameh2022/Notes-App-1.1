const addBox = document.querySelector(".add-box"),
    popUp = document.querySelector(".popup"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header span"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("#title"),
    descTag = popupBox.querySelector("#description"),
    addBtn = popupBox.querySelector(".btn");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Getting local storage notes if exist and parsing them to js object
// Else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

// Show pop-up
addBox.addEventListener("click", () => {
    titleTag.focus();
    popUp.classList.add("show");
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
});


// Close pop-up
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    popUp.classList.remove("show");
    popupBox.classList.remove("show");
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new note";
    document.querySelector("body").style.overflow = "auto";
});

document.addEventListener("keyup", (e) => {
    if (e.key == "Escape") {
        closeIcon.click();
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) {
        closeIcon.click();
    }
});


// Add note
addBtn.addEventListener("click", () => {
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if (noteTitle || noteDesc) {
        // Getting month, day & year from the current date
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day}, ${year}`
        }

        if (!isUpdate) {
            notes.push(noteInfo); // Adding a new note to notes
        }
        else {
            isUpdate = false
            notes[updateId] = noteInfo; // Updating a specified note
        }

        //  Saving notes to local storage
        localStorage.setItem("notes", JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        addBtn.click();
    }
});


// Show all notes
function showNotes() {
    document.querySelectorAll(".note").forEach((note) => note.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let noteTag = `<div class="note">
                        <div class="content">
                            <h2 class="title">${note.title}</h2>
                            <p class="description">${filterDesc}</p>
                        </div>
                        <div class="footer">
                            <span class="date">${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                        Edit
                                    </li>
                                    <li onclick="deleteNote(${id})">
                                        <i class="fa-regular fa-trash-can"></i>
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
        addBox.insertAdjacentHTML("afterend", noteTag);
    });
}
showNotes();

function showMenu(element) {
    element.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != element) {
            element.parentElement.classList.remove("show");
        }
    })
};

function deleteNote(noteId) {
    let confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let desc = filterDesc.replaceAll('<br/>', '\n');
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update the note";
}