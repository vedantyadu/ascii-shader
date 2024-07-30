import * as THREE from 'three'
import vertex_shader from './glsl/vertex'
import fragment_shader from './glsl/fragment'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OBJLoader, RenderPass, ShaderPass } from 'three/examples/jsm/Addons.js'
import ascii_vertex_shader from './glsl/asciivertex'
import ascii_fragment_shader from './glsl/asciifragment'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1)
renderer.setSize( window.innerWidth, window.innerHeight )
document.querySelector('#app')?.appendChild(renderer.domElement)
renderer.domElement.id = 'renderer'


const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex_shader,
  fragmentShader: fragment_shader,
  uniforms: {
    cameraPos: {value: camera.position}
  }
})

// const cube = new THREE.Mesh( geometry, shaderMaterial )
// scene.add(cube)

const loader = new OBJLoader()

loader.load(
	'/src/glsl/head.obj',
	function (object) {
    object.traverse(function (child) {
      if ( child instanceof THREE.Mesh ) {
          child.material = shaderMaterial;
          child.rotateZ(Math.PI)
          child.rotateY(Math.PI)
          child.translateY(-1)
      }
    })
		scene.add(object)
	},
	function (xhr) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )
	},
	function (err) {
		console.log(err)
	}
)


camera.position.z = 4

const controls = new OrbitControls( camera, renderer.domElement )
controls.update()

const texture = new THREE.TextureLoader().load('/src/glsl/asciitexture.png')

const asciiShader = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: null },
    asciiTex: {value: texture},
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: ascii_vertex_shader,
  fragmentShader: ascii_fragment_shader
})


const composer = new EffectComposer( renderer )

const renderPass = new RenderPass(scene, camera)
const asciiPass = new ShaderPass(asciiShader)

composer.addPass(renderPass)
composer.addPass(asciiPass)

function animate() {
	requestAnimationFrame(animate)
  controls.update()
	composer.render()
}

animate()
