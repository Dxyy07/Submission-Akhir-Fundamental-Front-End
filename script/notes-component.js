import LoadingEffect from './loading-effect.js'

const notesData = []

class NotesComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open',
        })
        this.notesContainer = null
        this.notesData = []

        const template = document.createElement('template')
        template.innerHTML = `
            <style>
                .notes-container {
                    display: grid;
                    grid-gap: 20px;
                    padding: 20px;
                    grid-template-columns: repeat(4, minmax(250px, 1fr));
                }
                .note-card {
                    border: 2px solid;
                    border-radius: 8px;
                    padding: 10px;
                    background-color: #141414;
                    height: 250px;
                    overflow-y: auto;
                    display: grid;
                    box-sizing: border-box;
                }
                .note-title {
                    font-family: 'Rubik';
                    font-size: 24px;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #D3D3D3;
                }
                .note-body {
                    font-size: 18px;
                    color: #676767;
                }
                .note-created-at {
                    color: #D3D3D3;

                }
                .delete-button {
                    margin-top: 5px;
                    background-color: #676767;
                    color: white;
                    min-height: 30px;
                    width: 100%;
                    border-radius: 20px;
                    cursor: pointer;
                    border: none; 
                    align-self: flex-end;
                }
                @media screen and (max-width: 1200px) {
                    .notes-container {
                        grid-template-columns: repeat(3, minmax(250px, 1fr));
                    }
                }
                @media screen and (max-width: 767px) {
                    .notes-container {
                        grid-template-columns: repeat(2, minmax(250px, 1fr));
                    }
                }
                @media screen and (max-width: 480px) {
                    .notes-container {
                        grid-template-columns: repeat(1, minmax(250px, 1fr));
                    }
                }
            </style>
            <div class="notes-container"></div>
        `

        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.notesContainer = this.shadowRoot.querySelector('.notes-container')
        this.fetchDataAndDisplayNotes()
        this.addEventListener('search', this.handleSearch.bind(this))
        document.addEventListener('noteadded', this.handleNoteAdded.bind(this))
        this.notesContainer.addEventListener(
            'click',
            this.handleNoteDelete.bind(this),
        )
    }

    deleteNoteFromData(noteId) {
        this.notesData = this.notesData.filter((note) => note.id !== noteId)
    }

    isDummyNoteById(noteId) {
        return notesData.some((note) => note.id === noteId)
    }

    // Metode handleNoteDelete() diperbarui untuk memanggil isDummyNoteById()
    async handleNoteDelete(event) {
        if (event.target.classList.contains('delete-button')) {
            const noteId = event.target.dataset.id

            // Cek apakah catatan yang akan dihapus adalah catatan dummy
            const isDummyNote = this.isDummyNoteById(noteId)

            if (isDummyNote) {
                // Jika catatan dummy, hapus dari tampilan saja
                const noteCard = event.target.closest('.note-card')
                noteCard.remove()
            } else {
                // Jika bukan catatan dummy, hapus dari API dan tampilkan ulang catatan
                try {
                    const response = await fetch(
                        `https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
                            method: 'DELETE',
                        },
                    )
                    if (!response.ok) {
                        throw new Error('Failed to delete note from the API')
                    }

                    // Hapus catatan dari data lokal (array notesData)
                    this.notesData = this.notesData.filter((note) => note.id !== noteId)

                    // Render ulang catatan setelah penghapusan
                    this.displayNotes()
                } catch (error) {
                    console.error('Error deleting note:', error)
                }
            }
        }
    }

    async fetchDataAndDisplayNotes() {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes')
            if (!response.ok) {
                throw new Error('Failed to fetch data from the API')
            }
            const responseData = await response.json()

            if (responseData.status === 'success') {
                this.notesData = responseData.data // Memperbarui notesData dengan array objek catatan dari respons API
                this.displayNotes() // Menampilkan catatan
            } else {
                throw new Error('Failed to fetch data: ' + responseData.message)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    displayNotes() {
        this.notesContainer.innerHTML = ''
        this.notesData.forEach((note) => {
            const noteCard = this.createNoteCard(note)
            this.notesContainer.appendChild(noteCard)
        })

        notesData.forEach((note) => {
            const noteCard = this.createNoteCard(note)
            this.notesContainer.appendChild(noteCard)
        })
    }

    handleNoteAdded(event) {
        const newNote = event.detail
        const newDate = new Date()
        newNote.createdAt = newDate.toISOString()
        const existingNote = this.notesData.find(
            (note) => note.title === newNote.title,
        )
        if (existingNote) {
            alert('Catatan dengan Judul yang sama sudah ada!')
            return
        }
        notesData.unshift(newNote)
        const noteCard = this.createNoteCard(newNote)
        this.notesContainer.insertBefore(noteCard, this.notesContainer.firstChild)

        window.alert('Note added successfully!')
    }

    handleSearch(event) {
        const searchText = event.detail
        const filteredNotes = notesData.filter((note) =>
            note.title.toLowerCase().includes(searchText),
        )
        this.renderFilteredNotes(filteredNotes)
    }

    createNoteCard(note) {
        const noteCard = document.createElement('div')
        noteCard.classList.add('note-card')
        const createdAtDate = new Date(note.createdAt)
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }
        const formattedDate = createdAtDate.toLocaleString('en-US', options)
        noteCard.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-body">${note.body}</div>
            <div class="note-created-at">Created at: ${formattedDate}</div>
            <button class="delete-button" data-id="${note.id}">Delete</button>
        `
        return noteCard
    }
}

customElements.define('notes-component', NotesComponent)

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
    return regex.test(dateString)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString()
}

export default DataNotes;