// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Sun
const sunGeo = new THREE.SphereGeometry(5, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({ emissive: 0xffff00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Function to create a planet
function createPlanet(radius, color, distance) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = distance;
  scene.add(mesh);
  return mesh;
}

// Orbit ring helper
function createOrbitRing(distance) {
  const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
  const material = new THREE.LineBasicMaterial({ color: 0x444444 });
  const ellipse = new THREE.LineLoop(geometry, material);
  scene.add(ellipse);
}

// Create Planets + Orbits
const mercury = createPlanet(1, 0xaaaaaa, 10); createOrbitRing(10);
const venus = createPlanet(1.5, 0xffcc66, 15); createOrbitRing(15);
const earth = createPlanet(2, 0x3399ff, 20); createOrbitRing(20);
const mars = createPlanet(1.2, 0xff3300, 25); createOrbitRing(25);
const jupiter = createPlanet(4, 0xff9966, 35); createOrbitRing(35);
const saturn = createPlanet(3.5, 0xffcc99, 45); createOrbitRing(45);
const uranus = createPlanet(2.5, 0x66ffff, 55); createOrbitRing(55);
const neptune = createPlanet(2.5, 0x6666ff, 65); createOrbitRing(65);

// Planets data
const planets = [
  { name: "Mercury", mesh: mercury, speed: 0.02, angle: 0, distance: 10 },
  { name: "Venus", mesh: venus, speed: 0.015, angle: 0, distance: 15 },
  { name: "Earth", mesh: earth, speed: 0.01, angle: 0, distance: 20 },
  { name: "Mars", mesh: mars, speed: 0.008, angle: 0, distance: 25 },
  { name: "Jupiter", mesh: jupiter, speed: 0.006, angle: 0, distance: 35 },
  { name: "Saturn", mesh: saturn, speed: 0.005, angle: 0, distance: 45 },
  { name: "Uranus", mesh: uranus, speed: 0.004, angle: 0, distance: 55 },
  { name: "Neptune", mesh: neptune, speed: 0.003, angle: 0, distance: 65 }
];

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.angle += p.speed;
    p.mesh.position.x = Math.cos(p.angle) * p.distance;
    p.mesh.position.z = Math.sin(p.angle) * p.distance;
  });

  renderer.render(scene, camera);
}
animate();

// Handle screen resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ✅ SPEED CONTROL PANEL
const slidersContainer = document.getElementById('sliders');

planets.forEach((planet, index) => {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '10px';

  const label = document.createElement('label');
  label.textContent = `${planet.name} Speed: `;

  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0.001';
  input.max = '0.05';
  input.step = '0.001';
  input.value = planet.speed;
  input.style.width = '120px';
  input.dataset.index = index;

  const display = document.createElement('span');
  display.textContent = planet.speed.toFixed(3);

  input.addEventListener('input', (e) => {
    const i = parseInt(e.target.dataset.index);
    const val = parseFloat(e.target.value);
    planets[i].speed = val;
    display.textContent = val.toFixed(3);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(display);
  slidersContainer.appendChild(wrapper);
});
