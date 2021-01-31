import { GLTFLoader } from './../sse/GLTFLoader.js';

const MyGame = new SSEngine(Settings, GLTFLoader);


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
    if(MyGame.SceneryBlock.length == MyGame.SceneryBlocksToLoad){
        MyGame.Scenery.forEach(block => {
            MyGame.Scene.add(block);
        });
    }
    console.log(`GAME: Scenery post-add run.`);
}

MyGame.AddScenery = (block) => {
    MyGame.SceneryBlock.push(block);

    for (let i = 0; i < MyGame.Settings.road.blocks; i++) {
        if(Math.random() > .6){
            let block = MyGame.SceneryBlock[MyGame.SceneryBlock.length-1].clone();
            block.position.z = i * MyGame.Settings.road.size.z;
            MyGame.Scenery  .push(block);
        }        
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
    MyGame.Player.MoveVector.x += dir * -0.2;
}

MyGame.Mouse = {
    x: 0,
    y: 0
}

MyGame.SteeringLoop = () => {
    
    let dist = MyGame.Mouse.x - MyGame.Player.position.x ;
    if(dist > 0 )
        MyGame.MovePlayer(1 * Math.min((MyGame.Mouse.x - MyGame.Player.position.x) * .001, 1));
        MyGame.Player.RotateVector.y = Math.min((-dist) * .001, .3);
        
    if( dist < 0)
        MyGame.MovePlayer(-1 * Math.min((MyGame.Player.position.x - MyGame.Mouse.x) * .001, 1) ); 
        MyGame.Player.RotateVector.y = Math.min((-dist) * .001, .3);

    if(MyGame.Mouse.y < window.innerHeight * .5)
        MyGame.RoadSpeedVector -= MyGame.Settings.player.speed.forward * Math.min((window.innerHeight * .5 - MyGame.Mouse.y) * .0025, 1);
}

MyGame.HandleMouse = (ev) => {
    let mx = ev.x - window.innerWidth * .5;
    MyGame.Mouse.x = mx;
    MyGame.Mouse.y = ev.y;
}

MyGame.ApplyPhysics = (element, dt) => {
    
    // if(element.MoveVector.x > 0)
    //     element.MoveVector.x -= MyGame.Settings.physics.gravity.x * dt;
    // if(element.MoveVector.x < 0)
    //     element.MoveVector.x += MyGame.Settings.physics.gravity.x * dt;

    // if (element.position.y > 0)
    //     element.MoveVector.y -= MyGame.Settings.physics.gravity.y * dt;
    // else {
    //     element.position.y = 0;
    //     element.MoveVector.y = 0;
    // }
}

MyGame.ApplySteering = (element, deltaTime) => {
    let wheels = MyGame.Player.getObjectByName("Wheels");
    if(wheels) wheels.rotation.x -= MyGame.RoadSpeedVector * .0033;   
    
    if(MyGame.RoadSpeedVector > -10.0){
        MyGame.Player.MoveVector.x *= Math.abs(MyGame.RoadSpeedVector * .1);
        MyGame.Player.RotateVector.y *= Math.abs(MyGame.RoadSpeedVector * .1);
    }else{
        if(MyGame.Player.rotation.y > 0) 
            MyGame.Player.rotation.y -= Math.abs(MyGame.RoadSpeedVector * .025) * deltaTime;
        if(MyGame.Player.rotation.y < 0) 
            MyGame.Player.rotation.y += Math.abs(MyGame.RoadSpeedVector * .025) * deltaTime;
    }
        
    MyGame.Player.rotation.y += MyGame.Player.RotateVector.y * deltaTime;
    if(MyGame.Player.rotation.y < -0.3) MyGame.Player.rotation.y = -0.3;
    if(MyGame.Player.rotation.y > 0.3) MyGame.Player.rotation.y = 0.3;
        
    if(MyGame.Player.position.x < -1.8) {
        MyGame.Player.position.x = -1.8;
        MyGame.Player.MoveVector.x = 1.5;
        MyGame.RoadSpeedVector *= 0.5;
        MyGame.Moog({freq: 300,attack: 10,decay: 500,oscilator: 0,vol: 0.2});
    }
    if(MyGame.Player.position.x > 1.8) {
        MyGame.Player.position.x = 1.8;
        MyGame.Player.MoveVector.x = -1.5;
        MyGame.RoadSpeedVector *= 0.5;
        MyGame.Moog({freq: 300,attack: 10,decay: 500,oscilator: 0,vol: 0.2});
    }

    MyGame.Player.position.x += MyGame.Player.MoveVector.x * deltaTime;
    MyGame.Player.position.y += MyGame.Player.MoveVector.y * deltaTime;
};

MyGame.MyLoop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Renderer.render(MyGame.Scene, MyGame.Camera);

    if(MyGame.RoadSpeedVector < 0) MyGame.RoadSpeedVector += MyGame.Settings.physics.gravity.x;
    if(MyGame.RoadSpeedVector < -MyGame.Settings.road.speed.max) MyGame.RoadSpeedVector = -MyGame.Settings.road.speed.max;
    if(MyGame.RoadSpeedVector > 0) {
        MyGame.RoadSpeedVector = 0;
        MyGame.Player.MoveVector.x = 0;
    }
    if(MyGame.Player){
        MyGame.ApplySteering(MyGame.Player, deltaTime);
        MyGame.ApplyPhysics(MyGame.Player, deltaTime);
        MyGame.SteeringLoop();
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

    MyGame.Moog({freq: 1000,attack: 80,decay: 400,oscilator: 0,vol: 0.2});
    MyGame.Moog({freq: 400,attack: 200,decay: 500,oscilator: 0,vol: 0.2});
    MyGame.Moog({freq: 500,attack: 200,decay: 1000,oscilator: 0,vol: 0.2});
}

window.addEventListener('mousemove', MyGame.HandleMouse);

MyGame.InitScenery();
MyGame.WelcomeLog();


// ROAD
MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/road_block_1.glb`,
    position: {x:0, y:-1, z:0}
}, MyGame.InitScene);

// PLAYER
MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/player.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.InitPlayer);


// SCENERY
MyGame.SceneryBlocksToLoad = 3;

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/scenery_block_1.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.AddScenery);

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/scenery_block_2.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.AddScenery);

MyGame.Loader.ImportModel({
    path: `./${Settings.game.folder}/models/scenery_block_3.glb`,
    position: {x:0, y:0, z:0}
}, MyGame.AddScenery);



MyGame.RoadSpeedVector = -10.0;

