import { GLTFLoader } from './../sse/GLTFLoader.js';

const MyGame = new SSEngine(Settings, GLTFLoader);

MyGame.ApplyPhysics = (element, dt) => {
    element.RotateVector.x -= element.RotateVector.x > 0 ? MyGame.Settings.physics.rotation.x * dt : 0;
    element.RotateVector.x = element.RotateVector.x < 0 ? 0 : element.RotateVector.x;
    if (element.position.y > 0)
        element.MoveVector.y -= MyGame.Settings.physics.gravity.y * dt;
    else {
        element.position.y = 0;
        element.MoveVector.y = 0;
        //element.RotateVector.x = 0;
    }
}

MyGame.InitScene = (block) => {
    MyGame.RoadBlock = block;
    MyGame.InitRoad();
    MyGame.MyLoop();
    console.log(`GAME: Scene initialized.`);
}

MyGame.InitScenery = () => {
    MyGame.SceneryBlock = [];
    MyGame.Scenery = [];


    console.log(`GAME: Scenery initialized.`);
}

MyGame.PostAddScenery = () => {
    if(MyGame.SceneryBlock.length == 2){
        MyGame.Scenery.forEach(block => {
            MyGame.Scene.add(block);
        });
    }
    console.log(`GAME: Scenery post-add run.`);
}

MyGame.AddScenery = (block) => {
    MyGame.SceneryBlock.push(block);

    for (let i = 0; i < MyGame.Settings.road.blocks; i++) {
        let block = MyGame.SceneryBlock[MyGame.SceneryBlock.length-1].clone();
        block.position.z = i * MyGame.Settings.road.size.z;
        MyGame.Scenery  .push(block);        
    }
    
    console.log(`GAME: Added scenery model.`);
    MyGame.PostAddScenery();
}

MyGame.InitRoad = () => {
    MyGame.Road = [];
    for (let i = 0; i < MyGame.Settings.road.blocks; i++) {
        let block = MyGame.RoadBlock.clone();
        block.position.z = i * MyGame.Settings.road.size.z;
        MyGame.Road.push(block);        
    }

    MyGame.Road.forEach(block => {
        MyGame.Scene.add(block);
    });

    console.log(`GAME: Infinite road initialized.`);
}

MyGame.InitPlayer = (player) => {
    MyGame.Player = player;
    MyGame.Player.MoveVector = {x:0,y:0,z:0};
    MyGame.Player.RotateVector = {x:0,y:0,z:0};
    MyGame.Scene.add(MyGame.Player);

    let shadow = MyGame.Player.getObjectByName("Shadow");
    shadow.material.transparent = true;
    shadow.material.depthWrite = false;

    console.log(`GAME: Player initialized.`);
}

MyGame.MovePlayer = (dir) => {
    MyGame.RoadSpeedVector -= dir;
}

MyGame.HandleClick = (ev) => {
    if (ev.x < window.innerWidth  * .5) MyGame.MovePlayer(-1);
    else MyGame.MovePlayer(1);
}


MyGame.MyLoop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Renderer.render(MyGame.Scene, MyGame.Camera);

    if(MyGame.RoadSpeedVector < -MyGame.Settings.road.speed.max) MyGame.RoadSpeedVector = -MyGame.Settings.road.speed.max;
    if(MyGame.RoadSpeedVector > 0) MyGame.RoadSpeedVector = 0;

    if(MyGame.Player){
        let wheels = MyGame.Player.getObjectByName("Wheels");
        if(wheels) wheels.rotation.x -= MyGame.RoadSpeedVector * .0033;    
        
        MyGame.Player.rotation.x += MyGame.Player.RotateVector.x * deltaTime;
        MyGame.Player.rotation.y += MyGame.Player.RotateVector.y * deltaTime;
        MyGame.Player.position.x += MyGame.Player.MoveVector.x * deltaTime;
        MyGame.Player.position.y += MyGame.Player.MoveVector.y * deltaTime;
        MyGame.ApplyPhysics(MyGame.Player, deltaTime);
    }

    MyGame.Road.forEach(road => {
        road.position.z += MyGame.RoadSpeedVector * deltaTime;
        if(road.position.z < -MyGame.Settings.road.size.z){
            road.position.z += MyGame.Settings.road.size.z * (MyGame.Settings.road.blocks - 1);
        }
    });

    MyGame.Scenery.forEach(element => {
        element.position.z += MyGame.RoadSpeedVector * deltaTime;
        if(element.position.z < -MyGame.Settings.road.size.z){
            element.position.z += MyGame.Settings.road.size.z * (MyGame.Settings.road.blocks - 1);
        }
    });

    document.title = `FPS: ${Math.round(1/deltaTime)}, dt: ${Math.round(deltaTime*10000)/10000}ms | ${Settings.game.title}`;
    requestAnimationFrame( MyGame.MyLoop );
}


MyGame.WelcomeLog = () => {
    console.log(`GAME: Starting [${Settings.game.title}].`);
    console.log(`GAME: Version [${Settings.game.version}].`);
}

window.addEventListener('click', MyGame.HandleClick);

MyGame.InitScenery();
MyGame.WelcomeLog();

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/player.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.InitPlayer);

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/scenery_block_1.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.AddScenery);

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/scenery_block_2.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.AddScenery);

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/road_block_1.glb`,
    position: {x:0, y:-1, z:0}
}, MyGame.InitScene);

MyGame.RoadSpeedVector = -10.0;

