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
dracoLoader.setDecoderPath('src/assets/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
let loader = new THREE.TextureLoader()

// cubeEnvMap
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  'Standard-Cube-Map/px.png',
  'Standard-Cube-Map/nx.png',
  'Standard-Cube-Map/py.png',
  'Standard-Cube-Map/ny.png',
  'Standard-Cube-Map/pz.png',
  'Standard-Cube-Map/nz.png',
])



// Textures
let sakuraTexture = loader.load(`/textures/sakura2.jpg`)
let sakura3Texture = loader.load(`/textures/sakura3.jpg`)
sakura3Texture.wrapS = THREE.RepeatWrapping
sakura3Texture.wrapT = THREE.RepeatWrapping
sakura3Texture.repeat.x = 1
sakura3Texture.repeat.y = 2

let hoodieBottomNormalMap = loader.load(`/textures/hoodieBottom.png`)
let hoodieTopNormalMap = loader.load(`/textures/hoodieTop.png`)
const topMaterial = new THREE.MeshStandardMaterial({
  map: sakura3Texture,
  side: THREE.DoubleSide,
})

const bottomMaterial = new THREE.MeshStandardMaterial({
  map: sakuraTexture,
  side: THREE.DoubleSide,
  envMap: environmentMapTexture,
  castShadow: true,
})


const hoodieLoader = async () => {
  const getObject3D = scene.getObjectByProperty('type', 'Group')
  scene.remove(getObject3D)
  gltfLoader.load(`/models/hoodie_and_skirt-optimized.glb`, (gltf) => {
    const hoodie = gltf.scene
    console.log(hoodie)
      / hoodie.children[0].traverse((child) => {
        child.material = bottomMaterial
        child.material.normalMap = hoodieBottomNormalMap
        child.material.normalScale.set(0.5, 0.5)
        child.material.castShadow = true

      })
    hoodie.children[1].traverse((child) => {
      child.material = topMaterial
      child.material.normalMap = hoodieTopNormalMap
    })
    hoodie.position.set(0, -1, 0);
    hoodie.scale.set(0.7, 0.7, 0.7);

    scene.add(hoodie);
  });
};

hoodieLoader()

const puffLoader = async () => {
  const getObject3D = scene.getObjectByProperty('type', 'Group')
  scene.remove(getObject3D)
  gltfLoader.load(`/models/puff_sleeve_and_jumper_skirt-optimized.glb`, (gltf) => {
    const hoodie = gltf.scene;
    hoodie.children[0].traverse((child) => {
      child.material = topMaterial
    })
    hoodie.children[1].traverse((child) => {
      child.material = bottomMaterial
    })

    hoodie.position.set(0, -0.2, 0);
    hoodie.scale.set(0.45, 0.45, 0.45);

    scene.add(hoodie);
  });
};




const changemap = (texture, top) => {
  console.log(texture)
  if (top === 'top') {
    topMaterial.dispose()
    topMaterial.map = loader.load(`/textures/${texture}.jpg`)
    topMaterial.needsUpdate = true
  } else {
    bottomMaterial.dispose()
    bottomMaterial.map = loader.load(`/textures/${texture}.jpg`)
    bottomMaterial.needsUpdate = true
  }
}







// Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.set(2.91, 1.804, 1.558)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.intensity = 0.5
directionalLight.castShadow = true
directionalLight.shadow.radius = 10
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3
scene.add(camera)


// Resize Canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
scene.background = environmentMapTexture
scene.environment = environmentMapTexture
scene.backgroundBlurriness = 0.1
// Renderer
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({ canvas: webgl.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.useLegacyLights = true

}

const clock = new THREE.Clock()
onMounted(() => {
  setupRenderer()
  // Controls
  const controls = new OrbitControls(camera, webgl.value)
  controls.enableDamping = true
  controls.maxDistance = 5
  controls.minDistance = 2
  controls.enablePan = false

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
    <button @click="hoodieLoader()">Hoodie</button>
    <button @click="puffLoader()">Puff</button>
    <span>-------</span>
    <button @click="changemap('sakura2')">Bottom Texture 1</button>
    <button @click="changemap('sakura3')">Bottom Texture 2</button>
    <span>-------</span>
    <button @click="changemap('sakura2', 'top')">Top Texture 1</button>
    <button @click="changemap('sakura3', 'top')">Top Texture 2</button>
  </div>
  <canvas class="webgl" ref="webgl"></canvas>
</template>
