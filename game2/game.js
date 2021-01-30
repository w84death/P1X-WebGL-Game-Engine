/**
 * P1X WEBGL GAME ENGINE
 * GAME TEMPLATE 2
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

import { Vector2, Vector3 } from '../engine/libs/three.module.js';
import { Engine } from './../engine/engine.js';
import { Settings } from './settings.js';

const MyGame = new Engine(Settings);

document.getElementById("gameTitle").innerHTML = Settings.game.title;
document.getElementById("gameVersion").innerHTML = Settings.game.version;

MyGame.Loop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.MainLoop.apply(this, [deltaTime]);

    
    document.getElementById('fps').innerHTML = `FPS:  ${Math.round(1/deltaTime)}, Delta time: ${Math.round(deltaTime*10000)/10000}ms`;
    requestAnimationFrame( MyGame.Loop );
}

MyGame.Init();
MyGame.Loop();






