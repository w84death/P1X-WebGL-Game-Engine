/**
 * P1X WEBGL GAME ENGINE
 * GAME TEMPLATE
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

import { Engine } from './../engine/engine.js';
import { Settings } from './../engine/settings.js';

const MyGame = new Engine(Settings);

document.getElementById("gameTitle").innerHTML = Settings.game.title;
document.getElementById("gameVersion").innerHTML = Settings.game.version;

MyGame.InitScene = () => {
    MyGame.ImportModel({
        path: './game/models/moon.glb',
        position: {x:0, y:0, z:0}
    });

    MyGame.ImportModel({
        path: './game/models/lunar_lander.glb',
        position: {x:0, y:.5, z:4}
    });
    
    MyGame.ImportModel({
        path: './game/models/player.glb',
        position: {
            x: -2.5 + Math.random() * 5, 
            y: 1, 
            z: -2.5 + Math.random() * 5, }
    });
};
MyGame.Init();
MyGame.NetworkConnect();

MyGame.PlayerMovement = (dt) => {
    let speed = 2;
    
    if(!MyGame.Player) return;

    
    if ( MyGame.Keyboard.pressed("left") ) {
        //MyGame.Player.MoveVector.x = -1.0;
        MyGame.Player.rotation.y += 1.0 * speed * dt;
    }
    if ( MyGame.Keyboard.pressed("right") ) {
        //MyGame.Player.MoveVector.x = 1.0;
        MyGame.Player.rotation.y -= 1.0 * speed * dt;
    }	
    if ( MyGame.Keyboard.pressed("down") ) {
        MyGame.Player.MoveVector.z = 1.0;
    }
    if ( MyGame.Keyboard.pressed("up") ) {
        MyGame.Player.MoveVector.z = -1.0;
    }
    if ( MyGame.Keyboard.pressed("space") && MyGame.Player.position.y < 1) {
        MyGame.Player.MoveVector.y = 2.0;
    }

    if(MyGame.Player.MoveVector.x > 0) MyGame.Player.MoveVector.x -= Settings.physics.gravity.x * dt;
    if(MyGame.Player.MoveVector.x < 0) MyGame.Player.MoveVector.x += Settings.physics.gravity.x * dt;
    if(MyGame.Player.MoveVector.z > 0) MyGame.Player.MoveVector.z -= Settings.physics.gravity.z * dt;
    if(MyGame.Player.MoveVector.z < 0) MyGame.Player.MoveVector.z += Settings.physics.gravity.z * dt;
    
    if(MyGame.Player.MoveVector.y > 0) MyGame.Player.MoveVector.y -= Settings.physics.gravity.y * dt;
    if(MyGame.Player.position.y > 0) MyGame.Player.position.y -= Settings.physics.gravity.y * dt;
    if(MyGame.Player.position.y < 0) MyGame.Player.position.y = 0;

    MyGame.Player.position.y += MyGame.Player.MoveVector.y * speed * dt;
    
    MyGame.Player.position.x += (Math.cos (-MyGame.Player.rotation.y) * speed * MyGame.Player.MoveVector.z) * dt;
    MyGame.Player.position.z += (Math.sin (-MyGame.Player.rotation.y) * speed * MyGame.Player.MoveVector.z) * dt;
}

MyGame.NetworkOnMessage = (packet) => {
    if (packet.data.includes("- connected"))
        MyGame.ImportModel({
            network_id: packet.data.id | Math.random() * 1024,
            path: './game/models/player.glb',
            position: {
                x: -2.5 + Math.random() * 5, 
                y: 1, 
                z: -2.5 + Math.random() * 5, }
        });
}

MyGame.InitPlayer = ()=> {
    MyGame.Player = MyGame.Scene.getObjectByName( "SM_Player" );
    if(!MyGame.Player) return;
    
    MyGame.Player.RotateVector = new THREE.Vector3( 0, 0, 0 );
    MyGame.Player.MoveVector = new THREE.Vector3( 0, 0, 0 );
    MyGame.Camera.lookAt(MyGame.Player.position);
}

MyGame.Loop = () => {
    MyGame.MainLoop.apply(this);
    
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Keyboard.update();
    MyGame.PlayerMovement(deltaTime);
    if(!MyGame.Player) MyGame.InitPlayer();
    // else MyGame.Camera.lookAt(MyGame.Player.position);
    requestAnimationFrame( MyGame.Loop );
}
MyGame.Loop();





