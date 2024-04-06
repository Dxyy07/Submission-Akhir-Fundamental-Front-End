class FooterElement extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const template = document.createElement('template')
    template.innerHTML = `
            <style>
                footer {
                    box-sizing:  border-box;
                    background-color: transparent;
                    color: #fff;
                    text-align: center;
                    padding: 10px;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                }
            </style>
            <footer>
                <p>&copy; 2024 Dxy Code. </p>
            </footer>
        `

    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('footer-element', FooterElement)

export default FooterCustom
