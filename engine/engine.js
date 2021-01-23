/**
 * P1X WEBGL GAME ENGINE
 * MAIN FILE
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { AmmoPhysics } from './libs/AmmoPhysics.js';

const Engine = function(Settings) {
    console.log("ENGINE: Engine starting..");

    // I love javascript...
    let engine = this;

    this.Scene = new THREE.Scene();
    this.Renderer = new THREE.WebGLRenderer();
    this.Loader = new GLTFLoader();
    this.Keyboard = new KeyboardState();
    this.Physics = {};
    this.Init = () => {
        console.log("ENGINE: Initialization started...");
        this.InitRenderer();
        this.InitEnvironment();
        this.InitLights();
        this.InitSkybox();
        this.InitMainCamera();
        this.InitControls();
        this.InitScene();
        console.log("ENGINE: Initialization ended.");
    };

    this.InitRenderer = () => {
        this.Renderer.setSize( Settings.game.width, Settings.game.height);
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Renderer.setClearColor( Settings.environment.background );
        this.Renderer.toneMapping = THREE.LinearToneMapping;
        this.Renderer.shadowMap.enabled = true;
        this.Renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.getElementById(Settings.game.domId).appendChild(this.Renderer.domElement);
        console.log("ENGINE: Renderer initialized.");
    },

    this.InitEnvironment = () => {
        this.Scene.background = new THREE.Color(Settings.environment.background);
        if(Settings.environment.fog.enabled)
            this.Scene.fog = new THREE.Fog( 
                Settings.environment.fog.color, 
                Settings.environment.fog.near, 
                Settings.environment.fog.far );

        this.Scene.add( new THREE.AmbientLight(Settings.environment.ambinet));
        console.log("ENGINE: Environment initialized.");
    };

    this.InitLights = () => {
        const light = new THREE.DirectionalLight( 
            Settings.environment.sun.color, 
            Settings.environment.sun.power );
        light.position.set(-150, 40, 0 );
        light.position.multiplyScalar( 1.3 );
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        this.Scene.add( light );
        console.log("ENGINE: Lights initialized.");
    };
    
    this.InitSkybox = () => {
        console.log("ENGINE: Skybox initialized (dummy).");
    };

    this.InitMainCamera = () => {
        this.Camera = new THREE.PerspectiveCamera( 
            Settings.camera.fov, 
            Settings.game.width / Settings.game.height, 
            Settings.camera.plane.near, 
            Settings.camera.plane.far );
    
        this.Camera.position.x = Settings.camera.position.x;
        this.Camera.position.y = Settings.camera.position.y;
        this.Camera.position.z = Settings.camera.position.z;
        this.Camera.lookAt( 0, 0.5, 0 );
        console.log(`ENGINE: Main camera initialized at [${this.Camera.position.x},${this.Camera.position.y},${this.Camera.position.z}].`);
    };

    this.InitControls = () => {
        this.Controls = new OrbitControls( this.Camera, this.Renderer.domElement );
        this.Controls.maxPolarAngle = Settings.camera.angle.polar;
        this.Controls.minDistance = Settings.camera.distance.min;
        this.Controls.maxDistance = Settings.camera.distance.max;
        console.log("ENGINE: Controls initialized (dummy).");
    };
    
    async function InitPhysics() {
        engine.Physics = await AmmoPhysics();
        engine.InitPhysicsScene();
        console.log("ENGINE: Physics initialized.");
    };

    this.InitPhysicsScene = () => {};
    this.InitScene = () => {};

    this.ImportModel = (options) => {
        this.Loader.load( options.path, function ( gltf ) {
            gltf.scene.position.x = options.position.x;
            gltf.scene.position.y = options.position.y;
            gltf.scene.position.z = options.position.z;
            
            engine.Scene.add(gltf.scene);
            console.log("ENGINE: Model ["+ options.name +"] imported.");

        }, undefined, function ( error ) {
            console.error( error );
        });
    };
    
    this.MainLoop = () => {
        this.Renderer.render(this.Scene, this.Camera);
        this.Keyboard.update();
    };
}

export { Engine };