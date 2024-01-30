// variable declarations
const themeAudio = new Audio('sounds/snake_theme.mp3')
const moveAudio = new Audio('sounds/move.mp3')
const eatAudio = new Audio('sounds/eating_sound.m4a')
const gameOver = new Audio('sounds/game_over.m4a')
themeAudio.play()
let snake = document.getElementById('snake')
let gname = document.getElementById('game_name')
let play = document.getElementById('play_button')
let board = document.getElementById('board')
let scoreVal = document.getElementById('scoreValue')
let sName = document.getElementById('score')
let hscoreVal = document.getElementById('hscoreValue')
let hsName = document.getElementById('hscore')
let game_over = document.getElementById('game_over')
let playAgain = document.getElementById('play_again')
let speed = 10
let lTime = 0
score = 0
hscore = localStorage.getItem('high_score')
if(hscore === null){
    localStorage.getItem('high_score','0') 
}
let isPaused = false
scoreVal.innerHTML = score
hscoreVal.innerHTML = hscore
let direction = { x: 0, y: 0 }
let snakeArr = [{ x: 9, y: 9}]
let food = { x: 9, y: 13 }
let currKeyPress
let prevKeyPress

//functions goes here
play.addEventListener('click', () => {
    moveAudio.play()
    snake.style.display = 'none'
    gname.style.display = 'none'
    play.style.display = 'none'
    window.requestAnimationFrame(main)
})
function main(ctime) {
    window.requestAnimationFrame(main)
    if((ctime - lTime)/1000 < 1/speed){
        return
    }
    lTime = ctime
    if(!isPaused)gameEngine()
}
function isCollide(snake){
    for(let i=1; i<snakeArr.length;i++){
       if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
            return true;
        }
        if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
            return true;
        }
    }
}
function reset(){
    themeAudio.pause()
    gameOver.play()
    game_over.style.display = 'revert' 
    playAgain.style.display ="revert"
    isPaused = true
}
playAgain.addEventListener('click',()=>{
    moveAudio.play()
    isPaused = false
    themeAudio.play()
    playAgain.style.display ="none"
    game_over.style.display = "none"

    direction = { x: 0, y: 0 }
    snakeArr = [{ x: 9, y: 9}]
    score=0    
    scoreVal.innerHTML = score
})
function gameEngine() {
    sName.style.visibility ="visible"
    hsName.style.visibility ="visible"
    for(let i=snakeArr.length-2; i>=0; i--){
        snakeArr[i+1] = {...snakeArr[i]}
    }
    snakeArr[0].x+= direction.x;
    snakeArr[0].y+= direction.y;
    
    // game over condtion
    if(isCollide(snakeArr)){
        reset()
    }
    if(snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0){
        reset()    
    }
    // display snake after eating food
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        eatAudio.play()
        snakeArr.unshift({x:snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y})
        score += 1
        scoreVal.innerHTML = score
        if(score > JSON.parse(hscore)){
            hscore = score
            localStorage.setItem('high_score',hscore)
        }
        hscoreVal.innerHTML = hscore

        // display food randomly 
        let a=2
        let b=16
        food = {x:Math.round(a+(b-a)* Math.random()),y:Math.round(a+(b-a)* Math.random())}
    }
    
    // move snake   
    board.innerHTML =""
    snakeArr.forEach((ele, i) => {
        snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = ele.y;
        snakeElement.style.gridColumnStart = ele.x;
        if(i === 0){
            snakeElement.classList.add('snakeHead')
            // eyeElement = document.createElement('div')          
            // eyeElement.classList.add('snakeEyes')
            // snakeElement.appendChild(eyeElement)
        }
        else{
        snakeElement.classList.add('snakeBody')
        }
        board.appendChild(snakeElement)
    })
    // display food img
    foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement)
}
window.addEventListener('keydown', (key) => {
    prevKeyPress = currKeyPress
    currKeyPress = key.code
    moveAudio.play()

    switch(key.code){
        case 'ArrowUp':
            if(prevKeyPress !== 'ArrowDown'){
                direction.x = 0
                direction.y = -1
            }               
            break;  
        case 'ArrowDown':
            if(prevKeyPress !== 'ArrowUp'){
                direction.x = 0
                direction.y = 1
            }
            break;
        case 'ArrowLeft':
            if(prevKeyPress !== 'ArrowRight'){
                direction.x = -1
                direction.y = 0 
            }           
            break;
        case 'ArrowRight':
            if(prevKeyPress !== 'ArrowLeft'){
                direction.x = 1
                direction.y = 0
            }          
            break;   
        default:
            break   
    }           
})