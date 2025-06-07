// ======== style.css must still be included in your HTML ========

// import { Triangle } from "three";

// // ========== UTILS ==========
// const preloadFonts = id => {
//     return new Promise((resolve) => {
//         WebFont.load({
//             typekit: {
//                 id: id
//             },
//             active: resolve
//         });
//     });
// };

// const adjustedBoundingRect = (el) => {
//     let rect = el.getBoundingClientRect();
//     let style = getComputedStyle(el);
//     let tx = style.transform;

//     if (tx) {
//         let sx, sy, dx, dy;

//         if (tx.startsWith('matrix3d(')) {
//             let ta = tx.slice(9,-1).split(/, /);
//             sx = +ta[0];
//             sy = +ta[5];
//             dx = +ta[12];
//             dy = +ta[13];
//         } else if (tx.startsWith('matrix(')) {
//             let ta = tx.slice(7,-1).split(/, /);
//             sx = +ta[0];
//             sy = +ta[3];
//             dx = +ta[4];
//             dy = +ta[5];
//         } else {
//             return rect;
//         }

//         let to = style.transformOrigin;
//         let x = rect.x - dx - (1 - sx) * parseFloat(to);
//         let y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(' ') + 1));
//         let w = sx ? rect.width / sx : el.offsetWidth;
//         let h = sy ? rect.height / sy : el.offsetHeight;
        
//         return {
//             x: x, y: y, width: w, height: h, top: y, right: x + w, bottom: y + h, left: x
//         };
//     } else {
//         return rect;
//     }
// };

// const offset = (el) => {
// 	const rect = el.getBoundingClientRect(),
// 		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
// 		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// 	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
// };

// const stringToColour = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     let colour = '#';
//     for (let i = 0; i < 3; i++) {
//       var value = (hash >> (i * 8)) & 0xFF;
//       colour += ('00' + value.toString(16)).substr(-2);
//     }
//     return colour;
// };

// // ========== PARTICLE CLASS ==========


// // ========== MOUSE PARTICLES EFFECT ==========


// // ========== APP INIT ==========




// class App {
//     constructor() {
//         this.size = {}

//         this.mouseParticlesEffect = new MouseParticlesEffect(
//             document.querySelector('.c-container'),
//             document.body
//         )

//         window.addEventListener('resize', () => {
//             this.resize()
//         })

//         requestAnimationFrame(this.update.bind(this))
//     }

//     update() {
//         this.mouseParticlesEffect.raf()
//         requestAnimationFrame(this.update.bind(this))
//     }

//     resize() {
//         this.size.x = window.innerWidth
//         this.size.y = window.innerHeight

//         if (this.mouseParticlesEffect) {
//             this.mouseParticlesEffect.resize({
//                 x: this.size.x,
//                 y: document.body.scrollHeight // 👈 important for scroll
//             });
    
//             // Also resize the container DOM element
//             this.mouseParticlesEffect.canvas.style.height = `${document.body.scrollHeight}px`;
//         }
//     }
// }

// new App();





// // if(this.mouseParticlesEffect) {
// //     this.mouseParticlesEffect.resize(this.size)




// // ✅ Updated trail.js
// export default class TrailApp {
//     constructor() {
//         this.size = {};

//         this.mouseParticlesEffect = new MouseParticlesEffect(
//             document.body,
//             document.body
//         );

//         window.addEventListener("resize", () => {
//             this.resize();
//         });

//         requestAnimationFrame(this.update.bind(this));
//     }

//     update() {
//         this.mouseParticlesEffect.raf();
//         requestAnimationFrame(this.update.bind(this));
//     }

//     resize() {
//         this.size.x = window.innerWidth;
//         this.size.y = window.innerHeight;

//         if (this.mouseParticlesEffect) {
//             this.mouseParticlesEffect.resize({
//                 x: this.size.x,
//                 y: document.body.scrollHeight,
//             });
//             this.mouseParticlesEffect.canvas.style.height = `${document.body.scrollHeight}px`;
//         }
//     }
// }

// class Particle {
//     constructor(x, y, color, velX, velY) {
//         this.x = x;
//         this.y = y;
//         this.color = color;
//         this.velX = velX;
//         this.velY = velY;
//         this.defaultSize = 2.5;
//         this.maxLife = 5;
//         this.life = 5;
//         this.gravity = 1;
//     }

//     draw(ctx) {
//         this.x += this.velX;
//         this.y += this.velY + this.gravity;

//         this.velX *= 0.99;
//         this.velY *= 0.99;

//         this.gravity += 0.01;
//         this.life -= 0.1;

//         this.size = Math.max(0, (this.defaultSize * this.life) / this.maxLife);

//         ctx.fillStyle = this.color;
//         ctx.save();
//         ctx.translate(this.x, this.y);
//         ctx.beginPath();
//         ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false);
//         ctx.fill();
//         ctx.restore();
//     }
// }

// class MouseParticlesEffect {
//     constructor(dom, parent) {
//         this.DOM = {};
//         this.DOM.root = dom;
//         this.DOM.parent = parent || dom;

//         this.canvas = document.createElement("canvas");
//         this.canvas.classList.add("c-mouse-particles");
//         this.context = this.canvas.getContext("2d");

//         this.DOM.root.prepend(this.canvas);

//         this.size = {
//             x: document.documentElement.clientWidth,
//             y: document.documentElement.clientHeight,
//         };

//         this.canvas.width = this.size.x;
//         this.canvas.height = this.size.y;

//         this.x = 0;
//         this.y = 0;

//         this.colors = ["#B5FFE1", "#93E5AB", "#65B891", "#4E878C", "#00241B"];
//         this.colorsClick = ["#59245c", "#d76669", "#f6cc71", "#1d1749"];

//         this.particles = [];

//         this.mouseMove();
//         this.mouseClick();
//     }

//     randomColor() {
//         return this.colors[Math.floor(Math.random() * this.colors.length)];
//     }

//     randomColorClick() {
//         return this.colorsClick[Math.floor(Math.random() * this.colorsClick.length)];
//     }

//     mouseClick() {
//         this.DOM.parent.addEventListener("click", (e) => {
//             let x = e.pageX - this.DOM.parent.offsetLeft;
//             let y = e.pageY - this.DOM.parent.offsetTop;

//             let dx = x - this.x;
//             let dy = y - this.y;

//             for (let i = 0; i < 60; i++) {
//                 let velX = Math.floor(dx / 10 + Math.random() * 60 * (Math.random() - 0.5));
//                 let velY = Math.floor(dy / 10 + Math.random() * 60 * (Math.random() - 0.5));

//                 this.particles.push(new Particle(x, y, this.randomColor(), velX, velY));
//             }

//             this.x = x;
//             this.y = y;
//         });
//     }

//     mouseMove() {
//         document.addEventListener("mousemove", (e) => {
//             let x = e.pageX - this.DOM.parent.offsetLeft;
//             let y = e.pageY - this.DOM.parent.offsetTop;

//             let dx = x - this.x;
//             let dy = y - this.y;

//             for (let i = 0; i < 6; i++) {
//                 let velX = Math.floor(dx / 1000000 + 3 * (Math.random() - 0.5));
//                 let velY = Math.floor(dy / 1000000 + 3 * (Math.random() - 0.5));

//                 this.particles.push(new Particle(x, y, this.randomColor(), velX, velY));
//             }

//             this.x = x;
//             this.y = y;
//         });
//     }

//     raf() {
//         this.context.clearRect(0, 0, this.size.x, this.size.y);

//         for (let i = 0; i < this.particles.length; i++) {
//             this.particles[i].draw(this.context);
//             if (this.particles[i].life <= 0) {
//                 this.particles.splice(i, 1);
//                 i--;
//             }
//         }
//     }

//     resize(size) {
//         this.size = size;
//         this.canvas.width = size.x;
//         this.canvas.height = size.y;
//     }
// }









import { Triangle } from "three"

// ========== UTILS ==========

const preloadFonts = id => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: { id: id },
            active: resolve
        })
    })
}

const offset = (el) => {
	const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const stringToColour = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
}

// ========== PARTICLE CLASS ==========

class Particle {
    constructor(x, y, color, velX, velY) {
        this.x = x
        this.y = y
        this.color = color
        this.velX = velX
        this.velY = velY
        this.defaultSize = 2.5
        this.maxLife = 5
        this.life = 5
        this.gravity = 1
    }

    draw(ctx) {
        this.x += this.velX
        this.y += this.velY + this.gravity

        this.velX *= 0.99
        this.velY *= 0.99

        this.gravity += 0.01
        this.life -= 0.1

        this.size = Math.max(0, (this.defaultSize * this.life) / this.maxLife)

        ctx.fillStyle = this.color
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.restore()
    }
}

// ========== MOUSE PARTICLES EFFECT CLASS ==========

class MouseParticlesEffect {
    constructor(dom, parent) {
        this.DOM = {}
        this.DOM.root = dom
        this.DOM.parent = parent || dom

        this.canvas = document.createElement("canvas")
        this.canvas.classList.add("c-mouse-particles")
        this.context = this.canvas.getContext("2d")

        this.DOM.root.prepend(this.canvas)

        this.size = {
            x: document.documentElement.clientWidth,
            y: document.documentElement.clientHeight,
        }

        this.canvas.width = this.size.x
        this.canvas.height = this.size.y

        this.x = 0
        this.y = 0

        this.colors = ["#B5FFE1", "#93E5AB", "#65B891", "#4E878C", "#00241B"]
        this.colorsClick = ["#59245c", "#d76669", "#f6cc71", "#1d1749"]

        this.particles = []

        this.mouseMove()
        this.mouseClick()
    }

    randomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)]
    }

    randomColorClick() {
        return this.colorsClick[Math.floor(Math.random() * this.colorsClick.length)]
    }

    mouseClick() {
        this.DOM.parent.addEventListener("click", (e) => {
    

            let x = e.pageX - this.DOM.parent.offsetLeft
            let y = e.pageY - this.DOM.parent.offsetTop

            let dx = x - this.x
            let dy = y - this.y

            for (let i = 0; i < 60; i++) {
                let velX = Math.floor(dx / 10 + Math.random() * 60 * (Math.random() - 0.5))
                let velY = Math.floor(dy / 10 + Math.random() * 60 * (Math.random() - 0.5))

                this.particles.push(new Particle(x, y, this.randomColor(), velX, velY))
            }

            this.x = x
            this.y = y
        })
    }


        
      
    mouseMove() {
        document.addEventListener("mousemove", (e) => {
           
            let x = e.pageX - this.DOM.parent.offsetLeft
            let y = e.pageY - this.DOM.parent.offsetTop

            let dx = x - this.x
            let dy = y - this.y

            for (let i = 0; i < 6; i++) {
                let velX = Math.floor(dx / 1000000 + 3 * (Math.random() - 0.5))
                let velY = Math.floor(dy / 1000000 + 3 * (Math.random() - 0.5))

                this.particles.push(new Particle(x, y, this.randomColor(), velX, velY))
            }

            this.x = x
            this.y = y
        })
    }
    

    raf() {
        this.context.clearRect(0, 0, this.size.x, this.size.y)

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(this.context)
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1)
                i--
            }
        }
    }

    resize(size) {
        this.size = size
        this.canvas.width = size.x
        this.canvas.height = size.y
    }
}

// ========== TRAIL APP EXPORT ==========

export default class TrailApp {
    constructor() {
        this.size = {}

        this.mouseParticlesEffect = new MouseParticlesEffect(
            document.body,
            document.body
        )

        window.addEventListener("resize", () => {
            this.resize()
        })

        requestAnimationFrame(this.update.bind(this))
    }

    update() {
        this.mouseParticlesEffect.raf()
        requestAnimationFrame(this.update.bind(this))
    }

    resize() {
        this.size.x = window.innerWidth
        this.size.y = window.innerHeight

        if (this.mouseParticlesEffect) {
            this.mouseParticlesEffect.resize({
                x: this.size.x,
                y: document.body.scrollHeight,
            })
            this.mouseParticlesEffect.canvas.style.height = `${document.body.scrollHeight}px`
        }
    }
}
