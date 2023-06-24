const MAX_RADIUS = 100

export default class Asteroid {
    constructor({position, size = 0, avgVertices = 10, jaggedness = 0.3, context, fps = 60}) {
        this.ctx = context
        this.fps = fps
        this.x = position.x
        this.y = position.y
        this.size = size
        this.speed = Math.pow(1.5, this.size + 1)
        this.r = Math.ceil(MAX_RADIUS / Math.pow(2.5, this.size))
        this.rotation = Math.PI * 2 * Math.random()
        this.vx = this.speed * Math.random() * (Math.random() < 0.5 ? 1: -1)
        this.vy = this.speed * Math.random() * (Math.random() < 0.5 ? 1: -1)
        
        this.avgVertices = avgVertices
        this.vertices = Math.floor(Math.random() * (avgVertices + 1) + (avgVertices / 2))
        this.jag = jaggedness

        // vertex offsets to create jaggedness
        this.offs = []
        for (let i=0; i<this.vertices; i++) {
            // random number between -this.jag and this.jag
            this.offs.push(2 * Math.random() * this.jag + 1 - this.jag)
        }
    }

    draw() {
        // draw a path
        this.ctx.beginPath()
        moveTo(
            this.x + this.r * this.offs[0] * Math.cos(this.rotation),
            this.y + this.r * this.offs[0] * Math.sin(this.rotation),
        )
        // draw the polygon
        for(let i=1; i < this.vertices; i++) {
            this.ctx.lineTo(
                this.x + this.r * this.offs[i] * Math.cos(this.rotation + i * Math.PI * 2 / this.vertices),
                this.y + this.r * this.offs[i] * Math.sin(this.rotation + i * Math.PI * 2 / this.vertices),
            )
        }
        this.ctx.closePath()
        this.ctx.strokeStyle = "slategray"
        this.ctx.lineWidth = 3
        this.ctx.stroke()

        // development: show bounding circle
        /* 
        this.ctx.strokeStyle = "lime"
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false)
        this.ctx.closePath()
        this.ctx.stroke()
         */
    }

    update() {
        this.draw()
        this.x += this.vx
        this.y += this.vy
    }
}