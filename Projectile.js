export default class Projectile {
    constructor({position, speed, angle, context, fps}) {
        this.x = position.x
        this.y = position.y
        this.speed = speed                              // pixels per frame
        this.angle = angle
        
        this.vx = this.speed * Math.cos(this.angle)
        this.vy = this.speed * Math.sin(this.angle)
        
        this.size = 3 
        this.ctx = context
        this.fps = fps
        this.maxDistance = this.speed * this.fps * 1    // distance traveled in 3 seconds
        this.distance = 0
    } 

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false)
        this.ctx.closePath()
        this.ctx.fillStyle = "white"
        this.ctx.fill()
    }

    update() {
        this.draw()

        this.x += this.vx
        this.y += this.vy

        this.distance += Math.sqrt(this.vx*this.vx + this.vy*this.vy)
    }
}