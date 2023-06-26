const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

import Player from "./Player.js"
import Asteroid from "./Asteroid.js"

// global constants
const FPS = 60
const ASTEROID_NUM = 3              // number of asteroids at start of level 1
const ASTEROID_SIZE = 200           // max asteroid size in pixels -- needed for initial generation 


// create player ship

const player = new Player({position: {x: canvas.width / 2, y:canvas.height / 2}, context: ctx, canvas: canvas, fps: FPS})
player.draw()


// create asteroids
let asteroids = []
createAsteroids()
asteroids.forEach(asteroid => asteroid.draw())

function createAsteroids() {
    asteroids = []
    let x,y
    for (let i = 0; i < ASTEROID_NUM; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width)
            y = Math.floor(Math.random() * canvas.height)
        }
        while(distBetweenPoints(player.x, player.y, x, y) < ASTEROID_SIZE * 2 + player.size)
        asteroids.push(new Asteroid({
            context: ctx,
            fps: FPS,
            position:{ x: x, y: y }
        }))
    }
    return asteroids
}

function destroyAsteroid(asteroid) {
    const asteroidIndex = asteroids.indexOf(asteroid)
    switch(asteroid.size) {
        case 0:
        case 1:
            for(let i=0; i < 2; i++) {
                asteroids.push(new Asteroid({
                    context: ctx,
                    position: {x: asteroid.x, y: asteroid.y},
                    size: asteroid.size + 1
                }))
            }
            break

        default:
            break
        
    }
    asteroids.splice(asteroidIndex,1)

}

function keyDown(event) {
    switch(event.code) {
        case "ArrowUp":
        case "KeyW":
            player.controls.up.pressed = true
            break
        case "ArrowRight":
        case "KeyD":
            player.controls.right.pressed = true
            break
        case "ArrowDown":
        case "KeyS": 
            player.controls.down.pressed = true
            break
        case "ArrowLeft":
        case "KeyA":
            player.controls.left.pressed = true
            break
        case "Space":
            player.shoot()
            break
    }
}
function keyUp(event) {
    switch(event.code) {
        case "ArrowUp":
        case "KeyW":
            player.controls.up.pressed = false
            break
        case "ArrowRight":
        case "KeyD":
            player.controls.right.pressed = false
            break
        case "ArrowDown":
        case "KeyS": 
            player.controls.down.pressed = false
            break
        case "ArrowLeft":
        case "KeyA":
            player.controls.left.pressed = false
            break
        case "Space":
            player.canShoot = true
            break
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    const dx = x2 - x1
    const dy = y2 - y1

    return Math.sqrt(dx*dx + dy*dy)
}

function updateFrame() {
    // draw space
    ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width, canvas.height)
   
    //update player
    player.update()

    // draw lasers
    player.projectiles.forEach(projectile => {projectile.update()})

    // check collision of asteroids with player
    for(let i=asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i]
    
        if(!player.shields && distBetweenPoints(player.x,player.y,asteroid.x,asteroid.y) < player.size + asteroid.r) {
            player.explode()
            destroyAsteroid(asteroid)
            break
        }
        asteroid.update()
    }
    
    

    // detect collisions of projectiles with asteroids
    for(let i=asteroids.length - 1; i>=0; i--) {
        const asteroid = asteroids[i]

        const ax = asteroid.x
        const ay = asteroid.y
        const ar = asteroid.r

        for(let j=player.projectiles.length - 1; j >= 0; j--) {
            const projectile = player.projectiles[j]

            const px = projectile.x
            const py = projectile.y

            if(distBetweenPoints(ax,ay,px,py) < ar) {

                projectile.explode()
                destroyAsteroid(asteroid)
                
                break
            }

            if (projectile.explodeTimer === 0) {player.projectiles.splice(j,1)}
        }
    }

    // remove projectiles after maximum time
    for(let i=player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i]
        if (projectile.numFrames >= projectile.maxTime) {
            player.projectiles.splice(i,1)
        }
    }

    // topology
    if (player.x < 0) player.x = canvas.width
    if (player.y < 0) player.y = canvas.height
    if (player.x > canvas.width) player.x = 0
    if (player.y > canvas.height) player.y = 0
    
    // asteroids topology
    asteroids.forEach(asteroid => {
        if (asteroid.x + asteroid.r < 0) asteroid.x = canvas.width + asteroid.r
        if (asteroid.x - asteroid.r > canvas.width) asteroid.x = 0 - asteroid.r
        if (asteroid.y + asteroid.r < 0) asteroid.y = canvas.height + asteroid.r
        if (asteroid.y - asteroid.r > canvas.height) asteroid.y = 0 - asteroid.r
    })
    
    // asteroids topology
    player.projectiles.forEach(projectile => {
        if (projectile.x + projectile.size < 0) projectile.x = canvas.width + projectile.size
        if (projectile.x - projectile.size > canvas.width) projectile.x = 0 - projectile.size
        if (projectile.y + projectile.size < 0) projectile.y = canvas.height + projectile.size
        if (projectile.y - projectile.size > canvas.height) projectile.y = 0 - projectile.size
    })

    
}

// animation loop
setInterval(updateFrame, 1000/FPS)

window.addEventListener("keydown", keyDown)
window.addEventListener("keyup", keyUp)