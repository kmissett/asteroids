import Projectile from "./Projectile.js"

export default class Player {
    constructor({canvas, context, position, velocity = {x:0, y:0}, fps = 60}) {
        this.canvas = canvas
        this.ctx = context
        this.size = 20
        this.x = position.x
        this.y = position.y
        this.vx = velocity.x
        this.vy = velocity.y
        this.rotation = -Math.PI / 2    // start with nose up
        
        // controls
        this.controls = {
            up:     {pressed: false},
            right:  {pressed: false},
            down:   {pressed: false},
            left:   {pressed: false},
        }

        // shooting
        this.canShoot = true
        this.projectilesMax = 10
        this.projectiles = []
        this.projectileSpeed = 10 // pixels per frame

        // constants
        this.fps = fps
        this.angularSpeed = Math.PI * 2 / this.fps
        this.acceleration = 2.25 / this.fps
        this.friction = 1 - this.acceleration


        // explode timer
        this.explodeDuration = Math.floor(0.5 * this.fps)
        this.explodeTimer = this.explodeDuration
        this.exploding = false

        // regeneration after collision
        this.shields = false
        this.shieldsDuration = 3 * this.fps  // seconds of shields
        this.shieldsTimer = 0
    }

    draw() {
        
        if(!this.exploding) {
            
            this.ctx.save()
            // handle player rotation
            this.ctx.translate(this.x, this.y)
            this.ctx.rotate(this.rotation)
            this.ctx.translate(-this.x, -this.y)
            
            // draw player's ship starting with nose pointing upwards
            this.ctx.beginPath()
            this.ctx.moveTo(this.x + this.size, this.y)
            this.ctx.lineTo(this.x - this.size * 0.866, this.y - this.size * 0.5)
            this.ctx.lineTo(this.x - this.size * 0.866, this.y + this.size * 0.5)

            this.ctx.closePath()

            this.ctx.strokeStyle = "white"
            this.ctx.lineWidth = this.size / 10
            this.ctx.stroke()

            if(this.shields) {

                this.ctx.beginPath()
                this.ctx.arc(this.x, this.y, 2 * this.size, 0, 2*Math.PI, false)
                this.ctx.closePath()
                this.ctx.strokeStyle = "lime"
                this.ctx.stroke()
            }

            // thruster if accelerating
            if(this.controls.up.pressed) {
                this.ctx.beginPath()
                this.ctx.moveTo(this.x - this.size * 0.866, this.y - this.size * 0.5 / 2)
                this.ctx.lineTo(this.x - this.size * 0.866, this.y + this.size * 0.5 / 2)
                this.ctx.lineTo(this.x - 1.5 * this.size, this.y)

                this.ctx.closePath()

                this.ctx.strokeStyle = "yellow"
                this.ctx.fillStyle = "red"
                this.ctx.lineWidth = this.size / 10
                this.ctx.fill()
                this.ctx.stroke()
            }
            this.ctx.restore()

        } else {
            const colors = ["darkred", "red", "orange", "yellow", "white"]
            const rMin = 0.5
            const sizeIncrement = 0.3

            for(let i=0; i < colors.length; i++) {
                this.ctx.fillStyle = colors[i]
                this.ctx.beginPath()
                this.ctx.arc(this.x,this.y, this.size * (rMin + sizeIncrement*(colors.length - i)), 0, 2*Math.PI, false)
                this.ctx.fill()
            }
        }

    }

    update() {

        this.draw()

        if(!this.exploding) {

            if(this.shieldsTimer >= 0) {
                this.shieldsTimer -=1
            } else {
                this.shields = false
                this.shieldsTimer = this.shieldsDuration
            }

            // change position
            this.x += this.vx
            this.y += this.vy

            // rotate player
            if(this.controls.right.pressed) this.rotation += this.angularSpeed
            else if(this.controls.left.pressed) this.rotation -= this.angularSpeed

            // thrust
            if (this.controls.up.pressed) {
                this.vx += this.acceleration * Math.cos(this.rotation)
                this.vy += this.acceleration * Math.sin(this.rotation)
            }
    
            // deceleration 
            if(this.controls.down.pressed) {
                this.vx *= this.friction
                this.vy *= this.friction
            }

        } else {
            this.vx = 0
            this.vy = 0
            this.explodeTimer -= 1;

            if (this.explodeTimer <= 0) {
                this.explodeTimer = this.explodeDuration
                this.exploding = false;
                this.x = this.canvas.width / 2
                this.y = this.canvas.height / 2

                this.shields = true
                this.shieldsTimer = this.shieldsDuration

                this.canShoot = true
            }
        }
    }

    shoot() {

        if(this.canShoot && this.projectiles.length < this.projectilesMax) {
            console.log("shoot")
            const position = {
                x: this.x + this.size * Math.cos(this.rotation), 
                y: this.y + this.size * Math.sin(this.rotation)
            }
            const speed = this.projectileSpeed
            const angle = this.rotation
            const context = this.ctx
            const fps = this.fps
            this.projectiles.push(new Projectile({position, speed, angle, context, fps})

            )
        }

        this.canShoot = false
    }

    explode() {
        this.exploding = true
        this.explodeTimer = this.explodeDuration
        this.canShoot = false 
    }
}