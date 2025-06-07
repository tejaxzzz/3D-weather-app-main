let spinBoost = 0; // rotation speed boost value
let spinPaused = false;

//land positions
const landPositions = [
    new THREE.Vector3(1.6, 0.4, 1.6),  // India
    new THREE.Vector3(-1.2, 0.3, 1.4), // Europe
    new THREE.Vector3(0.8, -0.2, 1.9), // China-ish
    new THREE.Vector3(-1.5, -0.5, 1.3), // Africa
    new THREE.Vector3(-0.9, 0.2, -1.8), // USA
    new THREE.Vector3(-0.3, -1.1, 1.6), // Australia
    new THREE.Vector3(1.4, 1.0, -1.2),  // Russia area
];



// Create yellow pulse marker
const markerGeometry = new THREE.RingGeometry(0.05, 0.1, 32)
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 })
const marker = new THREE.Mesh(markerGeometry, markerMaterial)
marker.rotation.x = -Math.PI / 2 // face camera
marker.visible = false


function showMarkerAtFront() {
    const radius = 9.01
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    const markerPosition = cameraDirection.multiplyScalar(-radius)
    marker.position.copy(markerPosition)
    marker.visible = true

    // Reset scale and opacity
    marker.scale.set(0.01, 0.01, 0.01)
    marker.material.opacity = 1

    // Animate: grow + fade out
    gsap.to(marker.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out"
    })

    gsap.to(marker.material, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
            marker.visible = false
        }
    })
}


scene.add(marker);