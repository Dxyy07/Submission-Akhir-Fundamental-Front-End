class LoadingIndicator extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  connectedCallback() {
    this.showLoadingIndicator()
    setTimeout(() => {
      this.hideLoadingIndicator()
    }, 700) // Delay 1 detik sebelum indikator loading hilang
  }

  showLoadingIndicator() {
    this.shadowRoot.querySelector('.loading').style.display = 'block'
  }

  hideLoadingIndicator() {
    this.shadowRoot.querySelector('.loading').style.display = 'none'
  }

  render() {
    const template = document.createElement('template')
    template.innerHTML = `
            <style>
                .loading {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 1);
                    z-index: 9999;
                }
                .spinner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('loading-indicator', LoadingIndicator)

export default LoadingEffect
