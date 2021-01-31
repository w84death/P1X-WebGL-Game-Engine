class SSELoader {
    constructor (GLTFLoader){
        this.Loader = new GLTFLoader();
        console.log(" * LOADER: Initialized.");
    }

    ImportModel = (options, callback=null) => {
        this.Loader.load( options.path, function ( gltf ) {
            gltf.scene.position.x = options.position.x;
            gltf.scene.position.y = options.position.y;
            gltf.scene.position.z = options.position.z;
            console.log(`ENGINE: Model [${gltf.scene.children[0].name}] imported.`);
            if(callback) callback(gltf.scene);
        }, undefined, function ( error ) {
            console.error( error );
        });
    }
}