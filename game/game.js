/**
 * P1X WEBGL GAME ENGINE
 * GAME TEMPLATE
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

import { Vector2, Vector3 } from '../engine/libs/three.module.js';
import { Engine } from './../engine/engine.js';
import { Settings } from './../engine/settings.js';

const MyGame = new Engine(Settings);

document.getElementById("gameTitle").innerHTML = Settings.game.title;
document.getElementById("gameVersion").innerHTML = Settings.game.version;

MyGame.InitLights = () => {};
MyGame.InitScene = () => {
    MyGame.InitPlayer();
    MyGame.InitMainCamera(MyGame.Scene.getObjectByName( "Camera" ));
    MyGame.Loop();
};
MyGame.isOnFloor = false;
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
        MyGame.Player.MoveVector.z = -1.2;
    }
    if ( MyGame.Keyboard.pressed("space") && MyGame.isOnFloor ) {
        MyGame.Player.MoveVector.y = 2.0;
        MyGame.Moog({
            freq: 200,
            attack: 25,
            decay: 250,
            oscilator: 0,
            vol: 0.1
        });
    }


    // SCENE PHYSICS
    // side
    if(MyGame.Player.MoveVector.x > 0) MyGame.Player.MoveVector.x -= Settings.physics.gravity.x * dt;
    if(MyGame.Player.MoveVector.x < 0) MyGame.Player.MoveVector.x += Settings.physics.gravity.x * dt;
    if(MyGame.Player.MoveVector.z > 0) MyGame.Player.MoveVector.z -= Settings.physics.gravity.z * dt;
    if(MyGame.Player.MoveVector.z < 0) MyGame.Player.MoveVector.z += Settings.physics.gravity.z * dt;
    
    //bottom
    if(MyGame.Player.MoveVector.y > 0) MyGame.Player.MoveVector.y -= Settings.physics.gravity.y * dt;
    if(MyGame.Player.MoveVector.y < 0) MyGame.Player.MoveVector.y = 0;

    // floor
    MyGame.isOnFloor = false;
    let rayStartPos = new Vector3(MyGame.Player.position.x,MyGame.Player.position.y, MyGame.Player.position.z);
    MyGame.Raycaster = new THREE.Raycaster(rayStartPos, new Vector3(0,-1,0), 0, 10);
    let collisionResults = MyGame.Raycaster.intersectObjects( MyGame.Scene.children, true );
    let minDistance = 10;
    collisionResults.forEach(c => {
        if(c.distance < minDistance) minDistance = c.distance; 
    });
    
    if(!collisionResults.length) minDistance = 0;
    if (minDistance > Settings.physics.gravity.y * dt + 0.1)
        MyGame.Player.position.y -= Settings.physics.gravity.y * dt;
    else if (minDistance < Settings.physics.gravity.y * dt)
        MyGame.Player.position.y += Settings.physics.gravity.y * dt;
    else MyGame.isOnFloor = true;
    
    // APPY PLAYER POSITION
    let newPosition = new Vector3();
    newPosition.x =  MyGame.Player.position.x + (Math.cos (-MyGame.Player.rotation.y) * speed * MyGame.Player.MoveVector.z) * dt;
    newPosition.y =  MyGame.Player.position.y + MyGame.Player.MoveVector.y * speed * dt;
    newPosition.z =  MyGame.Player.position.z + (Math.sin (-MyGame.Player.rotation.y) * speed * MyGame.Player.MoveVector.z) * dt;


    MyGame.Player.position.x = newPosition.x;
    MyGame.Player.position.z = newPosition.z;   
    MyGame.Player.position.y = newPosition.y;
}

MyGame.InitPlayer = ()=> {
    MyGame.Player = MyGame.Scene.getObjectByName( "SM_Player" );
    MyGame.Player.RotateVector = new THREE.Vector3( 0, 0, 0 );
    MyGame.Player.MoveVector = new THREE.Vector3( 0, 0, 0 );
}

MyGame.CameraFollow = (player) => {
     let offset = new THREE.Vector3(player.x + Settings.camera.follow.box.x, player.y + Settings.camera.follow.box.y, player.z);
     MyGame.Camera.position.lerp(offset, Settings.camera.follow.smooth);
     MyGame.Camera.lookAt(player); 
 }

MyGame.Loop = () => {
    MyGame.MainLoop.apply(this);
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.PlayerMovement(deltaTime);
    MyGame.CameraFollow(MyGame.Player.position);

    document.getElementById('fps').innerHTML = `FPS:  ${Math.round(1/deltaTime)}, Delta time: ${Math.round(deltaTime*10000)/10000}ms`;
    requestAnimationFrame( MyGame.Loop );
}

MyGame.Init();






