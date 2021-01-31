class SSCamera {
    constructor (settings) {
        this.Camera = new THREE.PerspectiveCamera( 
            settings.camera.fov, 
            window.innerWidth/window.innerHeight, 
            settings.camera.plane.near, 
            settings.camera.plane.far);
    
        this.Camera.position.x = settings.camera.pos.x;
        this.Camera.position.y = settings.camera.pos.y;
        this.Camera.position.z = settings.camera.pos.z;
        this.Camera.lookAt( 0, 1.2, 0 );
        console.log(` * CAMERA: Initialized at [${this.Camera.position.x},${this.Camera.position.y},${this.Camera.position.z}].`);
    
    }
}