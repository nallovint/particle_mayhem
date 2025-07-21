const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let particles = [];
let bounceSound;
let started = false;
let startText;

class Particle {
    constructor(scene, x, y, velocity, color) {
        this.scene = scene;
        this.sprite = scene.add.circle(x, y, 8, color);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(1, 1);
        this.sprite.body.setVelocity(velocity.x, velocity.y);
        this.bounceCooldown = 500;
        this.color = color;
        this.lastBounceTime = scene.time ? scene.time.now : 0;
    }

    update() {
        const body = this.sprite.body;
        const now = this.scene.time.now;
        if ((body.blocked.left || body.blocked.right || body.blocked.up || body.blocked.down) && now - this.lastBounceTime > this.bounceCooldown) {
            this.lastBounceTime = now;
            if (bounceSound && started) {
                bounceSound.setRate(Phaser.Math.FloatBetween(0.9, 1.1));
                bounceSound.play();
            }
            for (let i = 0; i < 2; i++) {
                const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
                const speed = Phaser.Math.Between(120, 200);
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const color = Phaser.Display.Color.RandomRGB().color;
                particles.push(new Particle(this.scene, body.x + body.width / 2, body.y + body.height / 2, { x: vx, y: vy }, color));
            }
        }
    }
}

function preload() {
    this.load.audio('bounce', 'pickupCoin.wav');
}

function create() {
    bounceSound = this.sound.add('bounce');
    startText = this.add.text(400, 300, 'Click to Start', {
        font: '32px Arial',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 },
        align: 'center'
    }).setOrigin(0.5);
    this.input.once('pointerdown', () => {
        startText.setVisible(false);
        started = true;
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const speed = Phaser.Math.Between(120, 200);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = Phaser.Display.Color.RandomRGB().color;
        particles.push(new Particle(this, 400, 300, { x: vx, y: vy }, color));
    });
}

function update() {
    if (!started) return;
    for (const p of particles) {
        p.update();
    }
}

const game = new Phaser.Game(config);
