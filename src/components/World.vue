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
dracoLoader.setDecoderPath('/src/assets/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
let loader = new THREE.TextureLoader()

const modelProperties = [
  {
    name: 'hoodie_and_skirt',
    top: 'parker',
    texture: {
      top: 'sakura2',
    },
    position: {
      x: 0,
      y: -1,
      z: 0
    },
    scale: {
      x: 0.04,
      y: 0.04,
      z: 0.04
    }
  },
  {
    name: 'puff_sleeve_and_jumper_skirt',
    top: 'skirt1',
    texture: {
      top: 'sakura2',
    },
    position: {
      x: 0,
      y: -0.2,
      z: -0
    },
    scale: {
      x: 0.5,
      y: 0.5,
      z: 0.5
    }
  }
]

// change top texture
let textureNewName = 'sakura2'

// Change model
const changeModel = async (model) => {
  // Remove previous model
  scene.remove(scene.children[3])
  // Load new model
  gltfLoader.load(`/models/${model.name}.glb`, (gltf) => {
    const hoodie = gltf.scene.children[0]
    hoodie.traverse((child) => {
      if (child.material?.name === 'parker') {
        child.material.map = new THREE.TextureLoader().load(`/textures/${textureNewName}.jpg`)
        child.material.needsUpdate = true;
      }
      if (child.isMesh) {
        child.material.roughness = 1;
      }
    })
    hoodie.position.set(model.position.x, model.position.y, model.position.z)
    hoodie.scale.set(model.scale.x, model.scale.y, model.scale.z)
    scene.add(hoodie)
  })
}

const changeName = (name) => {
  textureNewName = name
}

changeModel(modelProperties[1])


// Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.set(2, 2, 2)
directionalLight.intensity = 0.5
scene.add(directionalLight)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3
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
  <div>
    <button v-for="(model, index) in modelProperties" :key="index" @click="changeModel(model)">
      <p>Model: </p>{{ model.name + index }}
    </button>
    <p>-------</p>
    <button @click="changeName('sakura3')">texture 1</button>
    <button @click="changeName('sakura2')">texture 2</button>
  </div>
  <canvas class="webgl" ref="webgl"></canvas>
</template>
