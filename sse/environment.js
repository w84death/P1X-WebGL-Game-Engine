class SSEnvironment {
    constructor(settings, scene) {
        this.InitEnvironment(settings, scene);
        if(settings.environment.fog.enabled)
            this.AddFog(settings, scene);

        console.log("ENVIRONMENT: Initialized.");
    }

    InitEnvironment(settings, scene) {
        scene.background = new THREE.Color(settings.environment.background);
        scene.add(new THREE.AmbientLight(settings.environment.ambinet));
    }

    AddFog(settings, scene) {

        scene.fog = new THREE.Fog( 
            settings.environment.fog.color, 
            settings.environment.fog.near, 
            settings.road.blocks * (settings.road.size.z - 1));
        
    }
}