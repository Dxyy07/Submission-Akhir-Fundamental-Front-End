class AppHeader extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({
      mode: 'open',
    })

    const header = document.createElement('header')
    header.setAttribute('class', 'app-header')

    const title = document.createElement('h1')
    title.textContent = this.getAttribute('title') || 'Default Title'

    header.appendChild(title)

    const style = document.createElement('style')
    style.textContent = `
            .app-header {
                background-color: transparent;
                padding: 10px;
                text-align: center;
            }
            h1 {
                font-family:  'Rubik', sans-serif;
                text-align: center;
                font-size: 50px;
                color: antiquewhite;
            }
        `

    shadow.appendChild(style)
    shadow.appendChild(header)
  }
}

customElements.define('app-header', AppHeader)

export default HeaderCustom
