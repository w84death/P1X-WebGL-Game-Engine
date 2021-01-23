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

MyGame.PlayerMovement = () => {
    if (!MyGame.Player){
        MyGame.Player = MyGame.Scene.getObjectByName( "M_Player" ); 
    }else{
        if ( MyGame.Keyboard.pressed("left") ) {
            MyGame.Player.position.x -= 0.01;
        }
        if ( MyGame.Keyboard.pressed("right") ) {
            MyGame.Player.position.x += 0.01;
        }	
        if ( MyGame.Keyboard.pressed("down") ) {
            MyGame.Player.position.z += 0.01;
        }
        if ( MyGame.Keyboard.pressed("up") ) {
            MyGame.Player.position.z -= 0.01;
        }
    }
}

MyGame.Loop = () => {
    MyGame.MainLoop.apply(this);

    MyGame.Keyboard.update();
    MyGame.PlayerMovement();

    requestAnimationFrame( MyGame.Loop );
}
MyGame.Loop();





