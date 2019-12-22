window.addEventListener('load', function () {
    class Status {
        constructor() {
            this.id = 0;
            this.run = function () { return 0 };
        }
        setId(i = 0) {
            this.id = i;
        }
        setRun(f = function () { return 0 }) {
            this.run = f;
        }
    }
    class Game {
        
    }
});