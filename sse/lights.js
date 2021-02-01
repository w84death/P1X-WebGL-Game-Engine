class SSLights {
    constructor(settings, scene) {
        this.AddHemisphere(scene);
        this.AddDirectional(scene);
        console.log(" * LIGHTING: Lights initialized.");
    }

    AddHemisphere(scene) {
        console.log(" * LIGHTING: Adding hemishpere light.");
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
        hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
        hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
        hemiLight.position.set( 0, 50, 0 );
        scene.add( hemiLight );
    }

    AddDirectional(scene) {
        console.log(" * LIGHTING: Adding directional light.");
        const light = new THREE.DirectionalLight( 0xffffff , 1);
        light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set( -1, 1.75, 1 );
        light.position.multiplyScalar( 100 );

        light.castShadow = false;
        light.shadow.mapSize.width = 256;
        light.shadow.mapSize.height = 256;
        light.shadow.camera.near = .1;
        light.shadow.camera.far = 50;
        scene.add( light );
    }
}