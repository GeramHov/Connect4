// LOAD HEADER TEXT

class TextLoader {
    constructor(selector, delay) {
      this.header = document.querySelector(selector);
      this.text = this.header.innerText;
      this.delay = delay;
    }
  
    load() {
      this.header.innerText = '';
  
      for (let i = 0; i < this.text.length; i++) {
        setTimeout(() => {
          this.header.innerText += this.text[i];
        }, this.delay * i);
      }
    }
  }
  
  const textLoader = new TextLoader('h1', 120);
  window.addEventListener('load', () => textLoader.load());