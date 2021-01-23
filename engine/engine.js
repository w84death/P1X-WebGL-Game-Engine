/**
 * P1X WEBGL GAME ENGINE
 * MAIN FILE
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const Engine = function(Settings) {
    console.log("ENGINE: Engine starting..");
    let engine = this;

    this.Clock = new THREE.Clock();
    this.Scene = new THREE.Scene();
    this.Renderer = new THREE.WebGLRenderer();
    this.Loader = new GLTFLoader();
    this.Keyboard = new KeyboardState();

    this.Init = () => {
        console.log("ENGINE: Initialization started...");
        this.InitRenderer();
        this.InitEnvironment();
        this.InitLights();
        this.InitSkybox();
        this.InitMainCamera();
        this.InitControls();
        this.InitScene();
        this.InitMoog();

        this.Moog({
            freq: 5000,
            attack: 80,
            decay: 400,
            oscilator: 3,
            vol: 0.2
        });
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
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
        hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
        hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
        hemiLight.position.set( 0, 50, 0 );
        this.Scene.add( hemiLight );
        
        const light = new THREE.DirectionalLight( 0xffffff , 1);
        light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set( -1, 1.75, 1 );
        light.position.multiplyScalar( 100 );
        this.Scene.add( light );

        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        let d = 50;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.far = 13500;
        this.Scene.add( light );
        console.log("ENGINE: Lights initialized.");
    };
    
    this.InitSkybox = () => {
        let skyboxImage = Settings.environment.sky.skybox;

        function createPathStrings(filename) {
            const basePath = "./textures/skybox/";
            const baseFilename = basePath + filename;
            const fileType = ".png";
            const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
            const pathStings = sides.map(side => {
                return baseFilename + "_" + side + fileType;
            });

            return pathStings;
        }

        function createMaterialArray(filename) {
            const skyboxImagepaths = createPathStrings(filename);
            const materialArray = skyboxImagepaths.map(image => {
            let texture = new THREE.TextureLoader().load(image);
        
            return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
            });
            return materialArray;
        }

        
        const materialArray = createMaterialArray(skyboxImage);
        const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
        const skybox = new THREE.Mesh(skyboxGeo, materialArray);
        this.Scene.add(skybox);
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

    this.InitMoog = () => {
        this.Audio = new (window.AudioContext || window.webkitAudioContext)();
        this.Moog = (params) => {
            var vol = params.vol || 0.2,
                attack = params.attack || 20,
                decay = params.decay || 300,
                freq = params.freq || 30,
                oscilator = params.oscilator || 0,
                gain = this.Audio.createGain(),
                osc = this.Audio.createOscillator();

            // GAIN
            gain.connect(this.Audio.destination);
            gain.gain.setValueAtTime(0, this.Audio.currentTime);
            gain.gain.linearRampToValueAtTime(params.vol, this.Audio.currentTime + attack / 1000);
            gain.gain.linearRampToValueAtTime(0, this.Audio.currentTime + decay / 1000);

            // OSC
            osc.frequency.value = freq;
            osc.type = oscilator; //"square";
            osc.connect(gain);

            // START
            osc.start(0);

            setTimeout(function() {
                osc.stop(0);
                osc.disconnect(gain);
                gain.disconnect(engine.Audio.destination);
            }, decay)
        };
        console.log("ENGINE: Moog autio initialized.");
    };


    this.ImportModel = (options) => {
        this.Loader.load( options.path, function ( gltf ) {
            gltf.scene.position.x = options.position.x;
            gltf.scene.position.y = options.position.y;
            gltf.scene.position.z = options.position.z;
            
            engine.Scene.add(gltf.scene);
            console.log(`ENGINE: Model [${gltf.scene.children[0].name}] imported.`);

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