// default constants
const PROJECTILE_MAX_TIME = 1           // number of seconds before projectile deleted
const PROJECTILE_EXPLODE_DURATION = 0.1 // number of seconds of projectile's explosion
const PROJECTILE_SPEED = 11             // pixels per frame

export default class Projectile {
    constructor({position, speed = PROJECTILE_SPEED, angle, context, fps}) {
        this.x = position.x
        this.y = position.y
        this.speed = speed                              // pixels per frame
        this.angle = angle
        
        this.vx = this.speed * Math.cos(this.angle)
        this.vy = this.speed * Math.sin(this.angle)
        
        this.size = 3 
        this.ctx = context
        this.fps = fps
        this.numFrames = 0
        this.maxTime = PROJECTILE_MAX_TIME * this.fps
        this.maxDistance = this.speed * this.maxTime              // distance traveled in 1 second
        this.distance = 0

        this.explodeDuration = Math.ceil(this.fps * PROJECTILE_EXPLODE_DURATION)    // duration of explosion when projectile hits asteroid
        this.explodeTimer = this.explodeDuration
        this.exploding = false
    } 

    draw() {
        if(!this.exploding) {
            this.ctx.beginPath()
            this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false)
            this.ctx.closePath()
            this.ctx.fillStyle = "white"
            this.ctx.fill()
        }
        else {
            // draw explosion
            const colors = ["darkred", "red", "orange", "yellow", "white"]


            for(let i=0; i < colors.length; i++) {
                this.ctx.fillStyle = colors[i]
                this.ctx.beginPath()
                this.ctx.arc(this.x,this.y, this.size * (colors.length - i), 0, 2*Math.PI, false)
                this.ctx.fill()
            }
        }
    }

    explode() {
        this.exploding = true
        this.explodeTimer = this.explodeDuration
    }

    update() {
        this.draw()
        this.numFrames++       

        if(this.exploding) {
            if(this.explodeTimer > 0) {this.explodeTimer--}
        }
        else {
            
            this.x += this.vx
            this.y += this.vy
        }
    }
}