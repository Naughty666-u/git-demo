// 喵喵计数器 - 功能丰富的版本
class CatCounter {
    constructor() {
        this.count = 0;
        this.maxCount = 0;
        this.history = [];
        this.historyIndex = -1;
        this.storageKey = 'catCounter';
        
        this.messages = [
            '😸 喵～',
            '😻 太开心了！',
            '😽 呼呼呼～',
            '😼 我在数数呢',
            '😾 这样可以吗？',
            '😿 再来一次吧',
            '🙀 哇！',
            '😹 哈哈哈～',
            '😸 又数一个！',
            '😻 我喜欢这个游戏！',
            '🐱 继续呢！'
        ];
        
        this.init();
        this.setupEventListeners();
    }
    
    // 初始化 - 从本地存储读取数据
    init() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            this.count = data.count || 0;
            this.maxCount = data.maxCount || 0;
            this.history = [this.count];
            this.historyIndex = 0;
        } else {
            this.history = [0];
            this.historyIndex = 0;
        }
        this.updateDisplay();
    }
    
    // 保存到本地存储
    save() {
        const data = {
            count: this.count,
            maxCount: this.maxCount,
            timestamp: new Date().toLocaleString('zh-CN')
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    // 增加计数
    increment() {
        this.count++;
        this.addToHistory();
        if (this.count > this.maxCount) {
            this.maxCount = this.count;
        }
        this.save();
        this.updateDisplay();
        this.playAnimation('increment');
    }
    
    // 减少计数
    decrement() {
        if (this.count > 0) {
            this.count--;
            this.addToHistory();
            this.save();
            this.updateDisplay();
            this.playAnimation('decrement');
        }
    }
    
    // 重置计数
    reset() {
        if (confirm('确定要重置计数吗？')) {
            this.count = 0;
            this.history = [0];
            this.historyIndex = 0;
            this.save();
            this.updateDisplay();
            this.playAnimation('reset');
        }
    }
    
    // 撤销
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.count = this.history[this.historyIndex];
            this.updateDisplay();
            this.playAnimation('undo');
        }
    }
    
    // 重做
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.count = this.history[this.historyIndex];
            this.updateDisplay();
            this.playAnimation('redo');
        }
    }
    
    // 添加到历史记录
    addToHistory() {
        // 如果在历史中间做了新操作，删除后面的记录
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(this.count);
        this.historyIndex++;
        
        // 限制历史记录数量
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    // 更新显示
    updateDisplay() {
        document.getElementById('count').textContent = this.count;
        const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
        document.getElementById('message').textContent = randomMessage;
        
        // 更新最高值显示
        if (document.getElementById('maxCount')) {
            document.getElementById('maxCount').textContent = this.maxCount;
        }
        
        // 更新当前数值显示
        if (document.getElementById('currentCount')) {
            document.getElementById('currentCount').textContent = this.count;
        }
        
        // 更新撤销/重做按钮状态
        const undoBtn = document.querySelector('.btn-undo');
        const redoBtn = document.querySelector('.btn-redo');
        
        if (undoBtn) {
            undoBtn.disabled = this.historyIndex <= 0;
        }
        if (redoBtn) {
            redoBtn.disabled = this.historyIndex >= this.history.length - 1;
        }
    }
    
    // 播放动画
    playAnimation(type) {
        const counterElement = document.getElementById('count');
        counterElement.style.transform = 'scale(1.2)';
        counterElement.style.color = '#f093fb';
        
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
            counterElement.style.color = '#764ba2';
        }, 200);
    }
    
    // 设置事件监听
    setupEventListeners() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.increment();
            } else if (e.key === '-') {
                e.preventDefault();
                this.decrement();
            } else if (e.key === '0') {
                e.preventDefault();
                this.reset();
            } else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        });
        
        // 添加 CSS 过渡
        const style = document.createElement('style');
        style.textContent = `
            #count {
                transition: all 0.3s ease;
            }
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 清空所有数据
    clearAll() {
        if (confirm('确定要清空所有数据吗？')) {
            localStorage.removeItem(this.storageKey);
            this.count = 0;
            this.maxCount = 0;
            this.history = [0];
            this.historyIndex = 0;
            this.updateDisplay();
        }
    }
}

// 初始化应用
let counter;
document.addEventListener('DOMContentLoaded', () => {
    counter = new CatCounter();
    
    // 暴露全局方法供HTML调用
    window.increment = () => counter.increment();
    window.decrement = () => counter.decrement();
    window.reset = () => counter.reset();
    window.undo = () => counter.undo();
    window.redo = () => counter.redo();
    window.clearAll = () => counter.clearAll();
});
