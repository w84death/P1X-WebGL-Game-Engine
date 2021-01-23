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

MyGame.Init();
MyGame.ImportModel({
    path: './game/models/moon.glb',
    name: 'Moon',
    position: {x:0, y:0, z:0}
});
MyGame.ImportModel({
    path: './game/models/player.glb',
    name: 'Player',
    position: {x:0, y:1, z:0}
});
MyGame.MainLoop();