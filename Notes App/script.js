const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = document.querySelector(".uil-times");
const addBtn = document.querySelector("#addBtn");
const descTag = document.querySelector("#description");
const titleTag = document.querySelector("#title");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const notes = JSON.parse(localStorage.getItem("notes")) || [];

let isUpdate = false, updateId;

// Show the popup to add a note
addBox.addEventListener("click", () => {
    popupBox.classList.add("show");
    titleTag.value = "";
    descTag.value = "";
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "ADD NOTE";
    isUpdate = false; // Reset the update flag for adding new notes
});

// Close popup
closeIcon.addEventListener("click", () => {
    popupBox.classList.remove("show");
});

// Add or update note
addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if (noteTitle || noteDesc) {
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day}, ${year}`
        };

        if (isUpdate) {
            // Directly update the existing note without creating a new one
            notes[updateId] = noteInfo;  // Modify the existing note in the array
        } else {
            // Add new note
            notes.push(noteInfo);
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        closeIcon.click();  // Close the popup after adding/updating
        showNotes();  // Refresh the notes
    }
});

// Show all notes
function showNotes() {
    const notesContainer = document.querySelector('.wrapper');

    // Clear existing notes
    document.querySelectorAll(".note").forEach(note => note.remove());

    // Add notes from the `notes` array
    notes.forEach((note, index) => {
        let liTag = `
            <li class="note">
                <p>${note.title}</p>
                <span>${note.description}</span>
                <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                        <i class="uil uil-ellipsis-h" onclick="showMenu(this)"></i>
                        <ul class="menu">
                            <li onclick="editNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                            <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </div>
            </li>
        `;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

// Edit note
function editNote(noteId, title, desc) {
    updateId = noteId;  // Set the ID of the note to be updated
    isUpdate = true;    // Set the flag for updating mode
    addBox.click();     // Show popup
    titleTag.value = title; // Pre-fill with the current note's title
    descTag.value = desc;   // Pre-fill with the current note's description
    popupTitle.innerText = "Update Note";
    addBtn.innerText = "UPDATE NOTE";
}

// Delete note
function deleteNote(noteId) {
    const confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    notes.splice(noteId, 1); // Remove the selected note from the array
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();  // Refresh the notes after deletion
}

// Show settings menu
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        // Close the settings menu if clicked outside
        if (e.target.tagName !== "I" || e.target !== elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Initially show all notes
showNotes();
