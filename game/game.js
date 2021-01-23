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
        path: './game/models/player.glb',
        position: {
            x: -2.5 + Math.random() * 5, 
            y: 1, 
            z: -2.5 + Math.random() * 5, }
    });
};
MyGame.Init();

MyGame.PlayerMovement = (dt) => {
    let speed = 2;
    if (!MyGame.Player){
        MyGame.Player = MyGame.Scene.getObjectByName( "M_Player" ); 
    }else{
        if ( MyGame.Keyboard.pressed("left") ) {
            MyGame.Player.position.x -= speed * dt;
        }
        if ( MyGame.Keyboard.pressed("right") ) {
            MyGame.Player.position.x += speed * dt;
        }	
        if ( MyGame.Keyboard.pressed("down") ) {
            MyGame.Player.position.z += speed * dt;
        }
        if ( MyGame.Keyboard.pressed("up") ) {
            MyGame.Player.position.z -= speed * dt;
        }
    }
}

MyGame.Loop = () => {
    MyGame.MainLoop.apply(this);
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Keyboard.update();
    MyGame.PlayerMovement(deltaTime);

    requestAnimationFrame( MyGame.Loop );
}
MyGame.Loop();





