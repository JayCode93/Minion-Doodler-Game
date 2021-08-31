// This ensures that the app.js file won't load 
// until all the html elements have loaded first.
document.addEventListener('DOMContentLoaded', () => {
    
    // Query selector is a JS method that allows 
    // me to pick out html elements
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platCount = 5 // plat is short for platforms
    let platforms = [] // empty array to store our platforms
    let upTimerId // A timer ID is a function that allows us to execute an action at a specific time
    let downTimerId
    let leftTimerId
    let rightTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let score = 0

    // createElement is going to create a html element
    // which is our doodler and below we'll append the doodler
    // into the grid function created above adding it into our grid
    // in the html file.

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left // This is to assign the doodler default position to be on the first platform
        // The code below is to move our doodler
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    
    }


    // class for platform
    class Platform {
        constructor(newPlatBottom) {
            
            this.bottom = newPlatBottom // 100px + i (1 or 2/3/4/5) multiplied by platform gap (600 px divided by 5 platforms)
            this.left = Math.random() * 315 // 315 because the width of the grid is 400px and the platform itself is 85px, 400 - 85 = 315
            this.visual = document.createElement('div')
            
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'

            grid.appendChild(visual)
        }
    }


    // Below is a function that will create our original platforms
    // using for loops to do this numerously.
    function createPlatforms() {
        for (let i = 0; i < platCount; i++) {
            let platGap = 600 / platCount // 600 is the height of our grid, 600px and we want the gap to be evenly spaced across that height
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom) // Platform(newPlatBottom) basically creates a new platform using the formula above it off 100 pixels plus i (the number of the current platform being referred to, 1/2/3/4/5) multiplied by the platform gap, which is 600 px divided by the amount of platforms altogether, being 5.
            platforms.push(newPlatform) // This pushes each new platform into the empty array, so at any given point, there are five objects in the array.
            console.log(platforms)

        }

    }

    // We only want to move the platforms if the doodler is in a certain position
    function movePlatforms() {
        if(doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -=4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform') // This is so that we can no longer see that specific platform
                    platforms.shift() // Gets rid of the first item in the array, which is the platform that is less than 10px from the bottom
                    score++ // This increments the score each time a platform is removed from the array, meaning that the doodler has bypassed that platform

                    // Now, we want to create a new platform, each time an old platform vanishes
                    let newPlatform = new Platform(600) // We passed through 600 so that a new platform can start at 600px which is the top of our grid
                    platforms.push(newPlatform) // Pushes the new platform into our array

                }
            })
        }
    }


    // doodler falling function
    function fall() {
        isJumping = false
          clearInterval(upTimerId) // cancels out the up timer ID each time the doodler falls
          downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
              gameOver()
            }

            // If the doodle falls onto a platform we want him to jump again
            platforms.forEach(platform => {
              if (
                  (doodlerBottomSpace >= platform.bottom) &&
                  (doodlerBottomSpace <= (platform.bottom + 15 /* 15 is the hieght between each platform */ )) &&
                  ((doodlerLeftSpace + 60 /* 60 is the width of the doodler */ ) >= platform.left) && 
                  (doodlerLeftSpace <= (platform.left + 85)) &&
                  !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                    isJumping = true
                }
            })
      
          },20)
      }
    
    
    
    // doodler jumping function
    function jump() {
        clearInterval(downTimerId) // cancels out the down timer ID each time the doodler jumps
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        },30)
    }


    function gameOver() {
        console.log('Game Over')
        isGameOver = true
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        } // This makes sure that the grid removes any of the children elements still present
        grid.innerHTML = 'Game Over! Your Final Score Is: ' + score  
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }


    // controlling the doodler
    function control(event) {
        if(event.key === 'ArrowLeft') {
            moveLeft()
        } else if (event.key === 'ArrowRight') {
            moveRight()

        } else if (event.key === 'ArrowUp') {
            moveStraight()

        }
    }


    function moveLeft() {
        if(isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function() {
            if(doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function() {
            if(doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)

    }

    // Below is a function for where the default position
    // of the doodler is when the game starts.
    function start() {
        if(!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    start();


})