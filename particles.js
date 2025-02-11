const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initNodes();
});

/* const colors = ['rgba(0,245,255,0.8)', 'rgba(0,200,224,0.8)']; 
 */

const colors = ['rgba(178, 165, 226, 0.8)', 'rgba(178, 180, 226, 0.8)']; 

class Node {
  constructor(angleOffset) {
    this.angleOffset = angleOffset;
    this.radius = Math.min(canvas.width, canvas.height) / 3;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.005 + Math.random() * 0.01;
  }
  update() {
    this.angle += this.speed;
  }
  getPosition() {
    return {
      x: canvas.width / 2 + this.radius * Math.cos(this.angle + this.angleOffset),
      y: canvas.height / 2 + this.radius * Math.sin(this.angle + this.angleOffset)
    };
  }
}

const nodes = [
  new Node(0),
  new Node((2 * Math.PI) / 3),
  new Node((4 * Math.PI) / 3)
];

function drawConnections() {
  ctx.beginPath();
  const positions = nodes.map(node => node.getPosition());
  ctx.moveTo(positions[0].x, positions[0].y);
  ctx.lineTo(positions[1].x, positions[1].y);
  ctx.lineTo(positions[2].x, positions[2].y);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(72, 37, 201, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Soft fill for a membrane effect
  ctx.fillStyle = 'rgba(110, 94, 168, 0.1)'; /* rgba(0,200,224,0.1) */
  ctx.fill();
}

class SubParticle {
  constructor() {
    this.nodeIndex = Math.floor(Math.random() * 3);
    this.progress = Math.random();
    this.speed = 0.002 + Math.random() * 0.004;
    this.size = Math.random() * 2 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.progress = 0;
  }
  draw() {
    const nextNode = (this.nodeIndex + 1) % 3;
    const posA = nodes[this.nodeIndex].getPosition();
    const posB = nodes[nextNode].getPosition();

    const x = posA.x + (posB.x - posA.x) * this.progress;
    const y = posA.y + (posB.y - posA.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let subParticles = [];

function initNodes() {
  subParticles = [];
  for (let i = 0; i < 50; i++) {
    subParticles.push(new SubParticle());
  }
}

initNodes();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw nodes
  nodes.forEach(node => node.update());
  drawConnections();

  // Update and draw sub-particles
  subParticles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();



/* Two Triangles: */

/* const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// CHANGED: On resize, update each triangle's center & radius.
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  triangles.forEach(triangle => {
    triangle.updateCenter(canvas.width / 2, canvas.height / 2);
  });
});

// ADDED: A single color scheme for both triangles.
const strokeStyle = 'rgba(0,200,224,0.3)';
const fillStyle = 'rgba(0,200,224,0.1)';
const particleColors = ['rgba(0,245,255,0.8)', 'rgba(0,200,224,0.8)'];

// Node class for a triangle vertex.
// CHANGED: Each node now uses its own center and radius provided by its Triangle.
class Node {
  constructor(angleOffset, cx, cy, radius) {
    this.angleOffset = angleOffset;
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.005 + Math.random() * 0.01;
  }
  update() {
    this.angle += this.speed;
  }
  getPosition() {
    return {
      x: this.cx + this.radius * Math.cos(this.angle + this.angleOffset),
      y: this.cy + this.radius * Math.sin(this.angle + this.angleOffset)
    };
  }
}

// SubParticle class follows the edge between two nodes.
class SubParticle {
  constructor(nodes, colors) {
    this.nodes = nodes;
    this.nodeIndex = Math.floor(Math.random() * 3);
    this.progress = Math.random();
    this.speed = 0.002 + Math.random() * 0.004;
    this.size = Math.random() * 2 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.progress = 0;
  }
  draw() {
    const nextIndex = (this.nodeIndex + 1) % 3;
    const posA = this.nodes[this.nodeIndex].getPosition();
    const posB = this.nodes[nextIndex].getPosition();
    const x = posA.x + (posB.x - posA.x) * this.progress;
    const y = posA.y + (posB.y - posA.y) * this.progress;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Triangle class that encapsulates its own nodes and sub‑particles.
// CHANGED: Instead of sharing nodes, each triangle creates its own nodes so that their movements are independent.
class Triangle {
  constructor(centerX, centerY, strokeStyle, fillStyle, particleColors) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.particleColors = particleColors;
    this.radius = Math.min(canvas.width, canvas.height) / 3;
    // Each triangle gets its own nodes.
    this.nodes = [
      new Node(0, this.centerX, this.centerY, this.radius),
      new Node((2 * Math.PI) / 3, this.centerX, this.centerY, this.radius),
      new Node((4 * Math.PI) / 3, this.centerX, this.centerY, this.radius)
    ];
    this.subParticles = [];
    for (let i = 0; i < 50; i++) {
      this.subParticles.push(new SubParticle(this.nodes, this.particleColors));
    }
  }
  update() {
    this.nodes.forEach(node => node.update());
    this.subParticles.forEach(particle => particle.update());
  }
  draw() {
    ctx.beginPath();
    const positions = this.nodes.map(node => node.getPosition());
    ctx.moveTo(positions[0].x, positions[0].y);
    ctx.lineTo(positions[1].x, positions[1].y);
    ctx.lineTo(positions[2].x, positions[2].y);
    ctx.closePath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    this.subParticles.forEach(particle => particle.draw());
  }
  // ADDED: Update the center and adjust each node on canvas resize.
  updateCenter(newCenterX, newCenterY) {
    // Here, we still want the triangles to move in overlapping areas,
    // so we offset their centers slightly relative to the new global center.
    // For example, one remains offset to the left, the other to the right.
    // We'll assume that the original offset remains (relative to the new center).
    // (You can customize this logic as needed.)
    const offsetX = this.centerX - (canvas.width / 2);
    const offsetY = this.centerY - (canvas.height / 2);
    this.centerX = newCenterX + offsetX;
    this.centerY = newCenterY + offsetY;
    this.radius = Math.min(canvas.width, canvas.height) / 3;
    this.nodes.forEach(node => {
      node.cx = this.centerX;
      node.cy = this.centerY;
      node.radius = this.radius;
    });
  }
}

// Create two triangles with different starting centers (so they start apart)
// yet their regions overlap because their centers are only slightly offset.
const triangles = [
  new Triangle(canvas.width / 2 - 100, canvas.height / 2, strokeStyle, fillStyle, particleColors),
  new Triangle(canvas.width / 2 + 100, canvas.height / 2, strokeStyle, fillStyle, particleColors)
];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  triangles.forEach(triangle => {
    triangle.update();
    triangle.draw();
  });
  requestAnimationFrame(animate);
}

animate();
 */