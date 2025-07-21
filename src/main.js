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
let started = false;
let startText;
let gameScene;
let counterText;
const MAX_PARTICLES = 20000;
let stopped = false;

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
            if (started && gameScene) {
                gameScene.sound.play('bounce', { rate: Phaser.Math.FloatBetween(0.9, 1.1) });
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
    gameScene = this;
    counterText = this.add.text(10, 10, 'Particles: 0', {
        font: '24px Arial',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0, 0).setDepth(1000);
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
    if (!started) {
        if (counterText) counterText.setText('Particles: 0');
        return;
    }
    if (stopped) return;
    if (counterText) counterText.setText('Particles: ' + particles.length);
    if (particles.length >= MAX_PARTICLES) {
        stopped = true;
        if (gameScene) {
            gameScene.add.text(400, 200, 'Simulation stopped at 20,000 particles', {
                font: '32px Arial',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(1001);
        }
        return;
    }
    for (const p of particles) {
        p.update();
    }
}

const game = new Phaser.Game(config);
