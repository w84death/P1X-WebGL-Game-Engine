class SSEngine {
    constructor (settings) {
        this.Version = 'alpha1';
        console.log(`ENGINE: Engine ver [${this.Version}] is starting..`);

        this.Settings = settings;
        this.Clock = new THREE.Clock();
        this.Scene = new THREE.Scene();
        this.InitRenderer();
        this.InitCamera();
        this.InitLight();
        this.InitEnvironment();
        this.InitMoog();

        window.addEventListener('resize', () => {
            this.HandleResize(this.Renderer, this.Camera);
        });
        console.log(`ENGINE: Started.`);
    }


    InitRenderer() {
        this.Renderer = new THREE.WebGLRenderer( {antialias: true});
        console.log(" * RENDERER: Adding tonal mapping.");
        // Set CustomToneMapping to Uncharted2
        // source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
        THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
        );
        this.Renderer.setSize( window.innerWidth, window.innerHeight);
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Renderer.setClearColor( this.Settings.environment.background );
        this.Renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.Renderer.toneMappingExposure = this.Settings.environment.postprocess.exposure;

        console.log(" * RENDERER: Adding shadow map.");
        this.Renderer.shadowMap.enabled = true;
        this.Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.Renderer.outputEncoding = THREE.sRGBEncoding;

        document.body.appendChild(this.Renderer.domElement);
        console.log(" * RENDERER: Initialized.");
    }

    InitCamera() {
        this.Camera = new THREE.PerspectiveCamera( 
            this.Settings.camera.fov, 
            window.innerWidth/window.innerHeight, 
            this.Settings.camera.plane.near, 
            this.Settings.camera.plane.far);
    
        this.Camera.position.x = this.Settings.camera.pos.x;
        this.Camera.position.y = this.Settings.camera.pos.y;
        this.Camera.position.z = this.Settings.camera.pos.z;
        this.Camera.lookAt( 0, 0, 0 );
        console.log(` * CAMERA: Initialized at [${this.Camera.position.x},${this.Camera.position.y},${this.Camera.position.z}].`);
    }

    InitLight() {
        console.log(" * LIGHTING: Adding hemishpere light.");
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
        hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
        hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
        hemiLight.position.set( 0, 50, 0 );
        this.Scene.add( hemiLight );
        
        console.log(" * LIGHTING: Adding directional light.");
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
        console.log(" * LIGHTING: Lights initialized.");
    }

    InitEnvironment() {
        this.Scene.background = new THREE.Color(this.Settings.environment.background);
        if(this.Settings.environment.fog.enabled)
            this.Scene.fog = new THREE.Fog( 
                this.Settings.environment.fog.color, 
                this.Settings.environment.fog.near, 
                this.Settings.environment.fog.far );

        this.Scene.add( new THREE.AmbientLight(this.Settings.environment.ambinet));
        console.log("ENVIRONMENT: Initialized.");
    };

    InitMoog() {
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
                gain.disconnect(this.Audio.destination);
            }, decay)
        };
        console.log("AUDIO: Moog audio initialized.");
    };

    HandleResize(renderer, camera) {
        renderer.setSize( window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    ImportModel(options, callback=null) {
        this.Loader.load( options.path, function ( gltf ) {
            gltf.scene.position.x = options.position.x;
            gltf.scene.position.y = options.position.y;
            gltf.scene.position.z = options.position.z;
            console.log(` * LOADER: Model [${gltf.scene.children[0].name}] loaded.`);
            if(callback) callback(gltf.scene);
        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    get Player() {
        return true;
    }
};