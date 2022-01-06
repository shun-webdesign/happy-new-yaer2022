import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import img from './img/cylinder.png'
import kanaName from './img/name-katakana.png'
import tiger from './img/tiger.png'




/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837', 10, 200)
scene.fog = fog

/**
 * Texture
 */

const texture = new THREE.TextureLoader().load(img, (texture)=>
{
    texture.minFilter = THREE.NearestFilter
})
const textureName = new THREE.TextureLoader().load(kanaName, (textureName)=>
{
    texture.minFilter = THREE.NearestFilter
})
const tigerMaterial = new THREE.TextureLoader().load(tiger, (tigerMaterial)=>
{
    texture.minFilter = THREE.NearestFilter
})


/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry( 5, 32, 32 ),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: textureName}
        },
        transparent: true,
        side: THREE.DoubleSide,
    })
)


const object2 = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 16, 10, 32, 15, true),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: texture}
        },
        transparent: true,
        side: THREE.DoubleSide,
    })
)

for (let i = 0; i < 10; i++) {
    const c = object2.clone()
    c.rotation.y = Math.PI / 2
    c.scale.set(i, i, i)
    object2.add(c)
}

const object3 = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 30, 10, 32, 5, true),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: textureName}
        },
        transparent: true,
        side: THREE.DoubleSide,
    })
)
object3.position.y = -20

for (let i = 0; i < 10; i++) {
    const c = object3.clone()
    c.rotation.y = Math.PI / 2
    c.scale.set(i, i, i)
    object3.add(c)
}

scene.add( object1,object2, object3)


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 45
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Light
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)
const pointLight = new THREE.PointLight(0xffffff, 2, 1000)
scene.add(pointLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xffffff, 1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // material.uniforms.uTime.value = clock.getElapsedTime

    // Animate objects
    object1.rotation.y = 90
    object1.position.x = Math.sin(elapsedTime * 0.5) * 1.0
    object1.rotation.x = (elapsedTime) * -0.4//回転
    object2.position.y = Math.sin(elapsedTime * 0.5) * 1.0
    object2.rotation.y = (elapsedTime) * -0.4//回転
    object2.rotation.x = 90
    object3.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object3.rotation.y = (elapsedTime) * -0.3//回転
    object3.rotation.x = 90


    // Cast a ray from the mouse and handle events
    raycaster.setFromCamera(mouse, camera)

    // Update controls
    controls.update()

    let i = 0;
    while (i < object2.children.length) {
        // object2.children[i].rotation.x += 0.01 + i * 0.01
        object2.children[i].rotation.y += 0.01 + i * 0.001
        i++;
    }

    while (i < object3.children.length) {
        // object3.children[i].rotation.x += 0.01 + i * 0.001
        object2.children[i].rotation.y += 0.01 + i * 0.001
        i++;
    }

    // Render
    renderer.render(scene, camera)
    // effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()