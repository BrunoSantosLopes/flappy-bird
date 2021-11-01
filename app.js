document.addEventListener('DOMContentLoaded' , () => {
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const game = document.querySelector('.game')
    const ground = document.querySelector('.ground-moving')
    const button = document.querySelector('.start')

    let birdGravityTimer;
    let generateObstacleTimer;
    let moveObstacleTimer;
    let birdBottom = 250;
    let gravity = 3.5;
    let gap = 660;
    let obstacles = [];
    let animation;
    let isGameOver = false;
    let score = 0;

    function initBird() {
        birdBottom = 250;
    }

    function gravityBird() {
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'

        if (birdBottom <= 150) {
            gameOver()
        }
    }

    function control(e) {
        if (e.keyCode === 32 || e.key === 'ArrowUp') {
            jump()
        }
    }

    function jump() {
        if (birdBottom < 640) birdBottom += 50
        bird.style.bottom = birdBottom + 'px';
        bird.classList.remove('down');
        bird.classList.add('up');
        clearTimeout(animation);
        animation = setTimeout(function () {
            bird.classList.add('down');
            bird.classList.remove('up');
        }, 200) 
    }

    
    class Obstacle {

        constructor(height, gap = 0) {
            this.left = 500;
            this.height = height + gap
            this.visual = document.createElement('div');
            if (gap > 0) this.visual.classList.add('topObstacle');
            if (gap === 0) this.visual.classList.add('obstacle');
            this.visual.style.left = this.left + 'px';
            this.visual.style.bottom = this.height + 'px';
            gameDisplay.appendChild(this.visual)
        }

        moveObstacle() {
            this.left -=2
            this.visual.style.left = this.left + 'px'

            if (this.left === -60) {
                obstacles.shift(this)
                gameDisplay.removeChild(this.visual)
            }

            if (this.left > 180 && 
                this.left < 280 && 
                ( 
                    ((this.height > birdBottom) && (this.height + 500 < birdBottom)) ||
                    ((this.height + 500 > birdBottom) && (this.height < birdBottom + 45))
                ) &&
                !isGameOver) {
                if(!isGameOver) gameOver()

                
            }
        }
    }


    function generateObstacle() {
        if (obstacles.length > 0) {
            score += 1;
            document.querySelector('.score p').innerHTML = score
        }
        let heigth = (Math.random() * 300) - 300
        let obstacle = new Obstacle(heigth, 0);
        let obstacleTop = new Obstacle(heigth, gap);
        obstacles.push(obstacle);
        obstacles.push(obstacleTop);
       
    }


    function moveObstacle() {
        obstacles.forEach(obstacle => {
            obstacle.moveObstacle();
        });
    }


    function mouseOutPause(e) {
        if (!game.contains(e.target)) {
            gameOver()
        }

    }

    function removeAllObstacle() {

        obstacles = [];

        let elems = document.getElementsByClassName('obstacle')

        console.log(elems)
        if (elems) {
            for (let x = 0; x < elems.length; x ++) {
                elems[x].parentNode.removeChild(elems[x]);
            }
        }
        


        elems = document.getElementsByClassName('topObstacle')
        if (elems) {
            for (let x = 0; x < elems.length; x ++) {
                elems[x].parentNode.removeChild(elems[x]);
            }
        }
        
       
       
    }
   
    function gameOver() {
        isGameOver = true
        ground.classList.add('ground')
        button.classList.remove('hide')
        clearInterval(birdGravityTimer)
        clearInterval(generateObstacleTimer)
        clearInterval(moveObstacleTimer)
        initBird();
        document.removeEventListener('keyup', control)
        document.removeEventListener("mousemove", mouseOutPause);
        document.removeEventListener("focus", gameOver);
        
    }


    function startGame() {
        isGameOver = false
        score = 0;
        document.querySelector('.score p').innerHTML = score;
       
        removeAllObstacle();
        button.classList.add('hide')
        ground.classList.remove('ground')
        birdGravityTimer = setInterval(gravityBird, 20);
        moveObstacleTimer = setInterval(moveObstacle, 18);
        generateObstacleTimer = setInterval(generateObstacle, 2000);
        jump();
        document.addEventListener('keyup', control)
        document.addEventListener("mousemove", mouseOutPause);
        document.addEventListener("focus", gameOver);
    }


    button.addEventListener("click", startGame);

})
