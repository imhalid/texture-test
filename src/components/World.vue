<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import GUI from 'lil-gui'

// First Setup
let renderer;
const gui = new GUI().close()
const debugObject = {}
const scene = new THREE.Scene()
const webgl = ref()

// Geometry
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffaa00 })
)
scene.add(box)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3
scene.add(camera)
scene.background = new THREE.Color('#ffffaa')

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
