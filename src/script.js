import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Texture
const textuloader = new THREE.TextureLoader()
const height = textuloader.load('./hmapl.png')

// Mesh
const planeterr = new THREE.PlaneBufferGeometry(620, 860, 80, 80)
const csphere = new THREE.SphereGeometry( 75, 3, 2 );
const sphere = new THREE.SphereGeometry( 15, 6, 6 );

// Materials

const material = new THREE.MeshStandardMaterial({
    color: 0x88ff33,
    wireframe: true,
    displacementMap: height,
    displacementScale: -180
})
const spheremat = new THREE.MeshStandardMaterial({
    color: 0xbbfeb3,
    wireframe: false,
})

// Objects
const mainsphere = new THREE.Mesh(csphere, spheremat)
const secsphere = new THREE.Mesh(sphere, spheremat)

const planeobj = new THREE.Mesh(planeterr, material)

//Terrain
scene.add(planeobj)
planeobj.rotation.x = 1.9;
planeobj.rotation.y = 0;
planeobj.position.z = -600;
planeobj.position.x = 0;
planeobj.position.y = 0;

//Sphere
scene.add(mainsphere)

mainsphere.position.z = -1250;
mainsphere.position.y = 340;

//stars
function addStar() {
	const geoStar = new THREE.SphereGeometry(1, 3, 3);
	const materialStar = new THREE.MeshStandardMaterial({ color: 0xfefeee, })
	const star = new THREE.Mesh( geoStar, materialStar );
	const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 800 ));
	// MatUtils randomly generates a number between -100 and 100
	star.position.set(x, y + 340, z -1350);
	scene.add(star)
}
Array(200).fill().forEach(addStar)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
const sunLight = new THREE.AmbientLight(0xffff, .6);
scene.add(sunLight);


//UI controls
gui.add(planeobj.rotation, 'x').min(0).max(2);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 20, 1000)
// camera.position.x = 0
camera.position.y = 0
camera.rotation.x = 0
camera.position.z = 34
scene.add(camera)

gui.add(camera.position, 'y').min(-300).max(250);
gui.add(camera.position, 'x').min(0).max(200);
gui.add(camera.position, 'z').min(-1000).max(1000);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //camera movement
    // camera.position.x = 0
    // camera.position.y = 116 * - (.02 * elapsedTime)
    // camera.position.z = 310 - (2 * elapsedTime)
    // camera.rotation.x =  10 + (2000 * elapsedTime)
    mainsphere.rotation.y = .5 * elapsedTime


    // Update objects
    // planeobj.rotation.z = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function moveCamera () {
	const t = document.body.getBoundingClientRect().top;
    if (t > -2500){
    camera.position.z = 34 +( t * 0.1);
    // camera.position.y = t * 0.02;
    camera.rotation.x = 0;
    }
    if ( t < -2500 && camera.position.z >= -650 && camera.position.y <=200) {
        camera.position.z = 34 + ( t * 0.1);
        // camera.position.y = t * 0.02;
        camera.position.y = -175 - ( t * 0.05);
        camera.rotation.x =  0;
    }
    if (camera.position.z <= -400 ){
        camera.rotation.x -= 0.34 + t * 0.00008;
    }
	// camera.position.y = t * 0.02;
	// console.log(camera.position.z + ' z');
    // console.log(camera.rotation.x + 'rx');
    // console.log(t + 'jeje');


}
document.body.onscroll = moveCamera;