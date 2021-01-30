class SSEngine {
    constructor (settings, GLTFLoader) {
        this.Version = 'alpha1';
        console.log(`ENGINE: Engine ver [${this.Version}] is starting..`);

        this.Settings = settings;
        this.Clock = new THREE.Clock();
        this.Scene = new THREE.Scene();
        this.Renderer = new SSRenderer(this.Settings).Renderer;
        this.Camera = new SSCamera(this.Settings).Camera;
        this.Lights = new SSLights(this.Settings, this.Scene);
        this.Environment = new SSEnvironment(this.Settings, this.Scene);
        this.Moog = new SSMoog().Moog;
        this.Loader = new SSELoader(GLTFLoader);

        window.addEventListener('resize', () => {
            this.HandleResize(this.Renderer, this.Camera);
        });
        console.log(`ENGINE: Started.`);
    }

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
};