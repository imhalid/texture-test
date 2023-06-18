<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

// First Setup
let renderer;
const gui = new GUI().close()
const debugObject = {}
const scene = new THREE.Scene()
const webgl = ref()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const loader = new THREE.TextureLoader()

// Textures
const sakuraTexture = loader.load('/textures/sakura2.jpg')
const sakura3Texture = loader.load('/textures/sakura3.jpg')
sakuraTexture.wrapS = THREE.RepeatWrapping
sakuraTexture.wrapT = THREE.RepeatWrapping
sakuraTexture.repeat.x = 2
sakuraTexture.repeat.y = 3
sakuraTexture.rotation = Math.PI * 0.25
sakuraTexture.center.x = 0.5
sakuraTexture.center.y = 0.5

// Geometry
gltfLoader.load('/models/hoodie_and_skirt.glb', (gltf) => {
  const hoodie = gltf.scene.children[0]
  hoodie.traverse((child) => {
    if (child.material?.name === 'parker') {
      child.material.map = sakuraTexture
      // child.material.map.needsUpdate = true;
    } else if (child.material?.name === 'skirt') {
      child.material.map = sakura3Texture
      // child.material.map.needsUpdate = true;
    }
    if (child.isMesh) {
      console.log(child.material)
      child.material.roughness = 0.5;
    }
  })
  hoodie.scale.set(0.025, 0.025, 0.025)
  hoodie.position.set(0, -2.9, 0)
  scene.add(hoodie)
})

// Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.set(2, 2, 2)
directionalLight.intensity = 0.5
scene.add(directionalLight)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2
scene.add(camera)
scene.background = new THREE.Color('#000000')

// Resize Canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Renderer
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({ canvas: webgl.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)
  renderer.useLegacyLights = true
}

const clock = new THREE.Clock()
onMounted(() => {
  setupRenderer()
  // Controls
  const controls = new OrbitControls(camera, webgl.value)
  controls.enableDamping = true

  // Animation
  const animation = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
  }
  animation()
})

</script>

<template>
  <canvas class="webgl" ref="webgl"></canvas>
</template>
