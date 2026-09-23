export class TextScramble {
  private el: HTMLElement;
  private chars: string;
  private queue: Array<{ from: string, to: string, start: number, end: number, char?: string }>;
  private frameRequest: number;
  private frame: number;
  private resolve: (value?: unknown) => void;
  
  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#@$%&0123456789';
    this.queue = [];
    this.frameRequest = 0;
    this.frame = 0;
    this.resolve = () => {};
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => this.resolve = resolve);
    this.queue = [];
    
    // Configurable duration (approximate frames)
    // 60 frames ~ 1000ms
    const totalFrames = 60;
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * totalFrames);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const charObj = this.queue[i];
      const { from, to, start, end, char } = charObj;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          charObj.char = this.randomChar();
        }
        output += `<span class="scramble-dim">${charObj.char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
