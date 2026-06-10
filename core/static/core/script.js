// --- 1. Core WebGL Engine Initialization ---
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4);
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 2. Advanced 3D Scene Geometry ---

// Deep Mesh Plane Environment
const terrainGeo = new THREE.PlaneGeometry(15, 15, 40, 40);
const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
    roughness: 0.5,
    metalness: 0.8,
    transparent: true,
    opacity: 0.12
});
const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
terrainMesh.rotation.x = -Math.PI / 2.3;
terrainMesh.position.y = -2;
terrainMesh.position.z = -2;
scene.add(terrainMesh);

// Floating Complex Geometry System (Central focus anchor)
const complexGeo = new THREE.IcosahedronGeometry(0.8, 1);
const complexMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
    metalness: 0.9,
    roughness: 0.1
});
const centralMesh = new THREE.Mesh(complexGeo, complexMat);
centralMesh.position.set(1.5, 0, 0); // Positioned to frame neatly next to hero text
scene.add(centralMesh);

// Ambient Star/Dust System
const dustGeo = new THREE.BufferGeometry();
const dustCount = 1200;
const dustPositions = new Float32Array(dustCount * 3);

for(let i = 0; i < dustCount * 3; i++) {
    dustPositions[i] = (Math.random() - 0.5) * 8;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustMat = new THREE.PointsMaterial({
    size: 0.008,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
const dustSystem = new THREE.Points(dustGeo, dustMat);
scene.add(dustSystem);

// --- 3. Lighting Architecture ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const blueFillLight = new THREE.PointLight(0xffffff, 0.8, 10);
blueFillLight.position.set(-4, -2, 2);
scene.add(blueFillLight);

// --- 4. Interactivity & Responsive Layout Handlers ---

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Dynamic tracking state to shift the 3D layout depending on screen width
const layoutState = {
    isMobile: window.innerWidth <= 768,
    meshTargetX: window.innerWidth <= 768 ? 0 : 1.5
};

// Initial scale correction check for phone screens on page load
if (layoutState.isMobile) {
    centralMesh.scale.set(0.7, 0.7, 0.7);
}

// Mouse track coordinates data mapping
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    // Trigger CSS 3D Image Card Tracking
    handleCardTilt(e);
});

// Scroll Tracking Matrix
let currentScrollY = 0;
window.addEventListener('scroll', () => {
    currentScrollY = window.scrollY / window.innerHeight;
});

// Structural 3D Card Tilt Effect (Vanilla JS)
const photoCard = document.getElementById('photoCard');
function handleCardTilt(e) {
    if(!photoCard) return;
    const rect = photoCard.getBoundingClientRect();
    
    // Check if element is inside view viewport window frame
    if(rect.top < window.innerHeight && rect.bottom > 0) {
        const cardX = e.clientX - rect.left - (rect.width / 2);
        const cardY = e.clientY - rect.top - (rect.height / 2);
        
        // Convert coordinates to precise degree tilts
        const angleX = -(cardY / (rect.height / 2)) * 12;
        const angleY = (cardX / (rect.width / 2)) * 12;
        
        photoCard.querySelector('.photo-inner').style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    }
}

// Reset Card structure on mouse leave
if(photoCard) {
    photoCard.addEventListener('mouseleave', () => {
        photoCard.querySelector('.photo-inner').style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}

// Responsive Window Adjustments & Camera Matrix Recalibration
window.addEventListener('resize', () => {
    // Update projection matrix to preserve original shape aspect ratios without distortion
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Adjust canvas layout sizes
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update responsive remapping states dynamically
    layoutState.isMobile = window.innerWidth <= 768;
    layoutState.meshTargetX = layoutState.isMobile ? 0 : 1.5;
    
    // Smoothly scale down object density if space decreases
    if (layoutState.isMobile) {
        centralMesh.scale.set(0.7, 0.7, 0.7);
    } else {
        centralMesh.scale.set(1, 1, 1);
    }
});

// --- 5. Real-Time Math Rendering Loop ---
const clock = new THREE.Clock();

const frameExecution = () => {
    const elapsedTime = clock.getElapsedTime();

    // Subtle automatic 3D environment idle animations
    centralMesh.rotation.y = elapsedTime * 0.1;
    centralMesh.rotation.x = elapsedTime * 0.05;
    dustSystem.rotation.y = elapsedTime * -0.02;
    dustSystem.rotation.x = elapsedTime * 0.01;

    // Morphing 3D Wave Grid (Altering vertex data patterns slightly over timeline)
    const positions = terrainGeo.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i+1];
        // Apply complex mathematical wave algorithm using sine waves
        positions[i+2] = Math.sin(x + elapsedTime) * 0.2 + Math.cos(y + elapsedTime) * 0.2;
    }
    terrainGeo.attributes.position.needsUpdate = true;

    // Linear Interpolation (Lerp) for ultra-smooth mouse tracking lag
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Apply tracking coordinate offsets combining mouse feedback and current viewport layout rules
    centralMesh.position.x = layoutState.meshTargetX + (targetX * 0.8);
    centralMesh.position.y = -(targetY * 0.8);
    
    // Dynamic Scene shift translation map coordinated directly to scrolling positions
    camera.position.y = -currentScrollY * 3.5;
    camera.position.z = 4 + (currentScrollY * 0.5);

    // Final frame render execution
    renderer.render(scene, camera);
    window.requestAnimationFrame(frameExecution);
};

// Fire Engine
frameExecution();

// Success form message
setTimeout(() => {
    const successBox = document.querySelector(".success");
    if (successBox) {
        successBox.style.display = "none";
    }
}, 3000); 