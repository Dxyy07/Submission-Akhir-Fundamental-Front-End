class AddNoteForm extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({
      mode: 'open',
    })

    const template = document.createElement('template')
    template.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    max-width: 400px;
                    height: 300px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                input[type="text"],
                textarea {
                    font-size: 16px;
                    resize : vertical;
                    margin-bottom: 10px;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                input[type="submit"] {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    background-color: #4CAF50;
                    color: white;
                    cursor: pointer;
                }
                input[type="submit"]:hover {
                    background-color: #45a049;
                }
            </style>
            <form id="add-note-form">
                <input type="text" id="note-title" placeholder="Title" required>
                <textarea id="note-body" placeholder="Enter Note" rows="4" required></textarea>
                <input type="submit" value="Add Note">
            </form>
        `

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.form = this.shadowRoot.getElementById('add-note-form')

    this.form.addEventListener('submit', this.addNote.bind(this))
  }

  async addNote(event) {
    event.preventDefault()

    const title = this.shadowRoot.getElementById('note-title').value
    const body = this.shadowRoot.getElementById('note-body').value

    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to add note to the API')
      }

      // Jika berhasil, kirim event 'noteadded' dengan detail catatan yang ditambahkan
      document.dispatchEvent(
        new CustomEvent('noteadded', {
          bubbles: true,
          composed: true,
          detail: {
            title,
            body,
          },
        }),
      )

      // Reset formulir
      this.form.reset()
      location.reload()
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }
}

customElements.define('add-note-form', AddNoteForm);

export default AddNote;
