import { GLTFLoader } from './../sse/GLTFLoader.js';

const MyGame = new SSEngine(Settings, GLTFLoader);

MyGame.MyLoop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Renderer.render(MyGame.Scene, MyGame.Camera);

    MyGame.Box.rotation.x += MyGame.Box.RotateVector.x * deltaTime;
    MyGame.Box.rotation.y += MyGame.Box.RotateVector.y * deltaTime;
    MyGame.Box.position.y += MyGame.Box.MoveVector.y * deltaTime;
    MyGame.ApplyPhysics(MyGame.Box, deltaTime);

    if(MyGame.RoadSpeedVector < -MyGame.Settings.road.speed.max) MyGame.RoadSpeedVector = -MyGame.Settings.road.speed.max;

    if(MyGame.RoadSpeedVector < 0) MyGame.RoadSpeedVector += 12 * deltaTime;
    if(MyGame.RoadSpeedVector > 0) MyGame.RoadSpeedVector = 0;
    if(MyGame.Box.position.y == 0) MyGame.RoadSpeedVector *= .3;

    MyGame.Road.forEach(road => {
        road.position.z += MyGame.RoadSpeedVector * deltaTime;
    });

    MyGame.Road.forEach(road => {
        if(road.position.z < -MyGame.Settings.road.size.z){
            road.position.z += MyGame.Settings.road.size.z * (MyGame.Settings.road.blocks - 1);
        }
    });

    document.title = `FPS: ${Math.round(1/deltaTime)}, dt: ${Math.round(deltaTime*10000)/10000}ms | ${Settings.game.title}`;
    requestAnimationFrame( MyGame.MyLoop );
}

MyGame.ApplyPhysics = (element, dt) => {
    element.RotateVector.x -= element.RotateVector.x > 0 ? MyGame.Settings.physics.rotation.x * dt : 0;
    element.RotateVector.x = element.RotateVector.x < 0 ? 0 : element.RotateVector.x;
    if (element.position.y > 0)
        element.MoveVector.y -= MyGame.Settings.physics.gravity.y * dt;
    else {
        element.position.y = 0;
        element.MoveVector.y = 0;
        element.RotateVector.x = 0;
    }
}

MyGame.InitScene = (block) => {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshLambertMaterial({color: 0xffcc00});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.MoveVector = {x:0,y:0,z:0};
    mesh.RotateVector = {x:0,y:0,z:0};
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    MyGame.Box = mesh;
    MyGame.Scene.add(MyGame.Box);

    MyGame.RoadBlock = block;
    MyGame.InitRoad();
    MyGame.MyLoop();
    console.log(`GAME: Scene initialized.`);
}

MyGame.InitRoad = () => {
    MyGame.Road = [];
    for (let i = 0; i < MyGame.Settings.road.blocks; i++) {
        let block = MyGame.RoadBlock.clone();
        block.position.z = i * MyGame.Settings.road.size.z;
        MyGame.Road.push(block);        
    }

    let id = 0;
    MyGame.Road.forEach(road => {
        road.blockZ = id++;
        MyGame.Scene.add(road);
    });

    MyGame.LastRoadItem = MyGame.Road[0];
    console.log(`GAME: Infinite road initialized.`);
}

MyGame.HandleClick = () => {
    MyGame.RoadSpeedVector -= 4;
    MyGame.Box.RotateVector.x = 2;
    MyGame.Box.MoveVector.y = MyGame.Box.position.y < 2 ? 3 : 0;
}

window.addEventListener('click', MyGame.HandleClick);

console.log(`GAME: Starting [${Settings.game.title}].`);
console.log(`GAME: Version [${Settings.game.version}].`);

MyGame.RoadSpeedVector = 0.0;
MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/road_block_1.glb`,
    position: {x:0, y:-1, z:0}
}, MyGame.InitScene);

