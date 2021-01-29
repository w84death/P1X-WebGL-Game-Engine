/**
 * P1X WEBGL GAME ENGINE
 * DEFAULT SETTINGS
 * 
 * CREATED: 23-01-2021
 * (c)2021 Cyfrowy Nomada
 */

const Settings = {
    game: { 
        title: 'Sample Moon Game',
        width: 800, 
        height: 600, 
        domId: 'game',
        version: 'alpha1',
        scene: 'moon_scene'
    },
    camera: {
        follow: {
            smooth: 0.01, 
            box: { x:6, y:4 },
        },
        plane: { near: 0.1, far: 30000 },
        fov: 50,
        distance: {min:4, max:12 },
        angle: {polar: Math.PI * 0.44}
    },
    environment: {
        background: 0x222222,
        fog: { enabled: false, color: 0x222222, near: 20, far: 1000 },
        sun: { color: 0xffffee, power: 1.4 },
        ambinet: 0x111111,
        sky: { skybox:  'purplenebula' },
        postprocess: {
            exposure: 0.8
        }
    },
    network: {
        //server: 'ws://194.126.207.20:8080'
        server: 'ws://0.0.0.0:8080'
    },
    physics: {
        gravity: { x:1, y:3, z:1}
    },
    player: {
        speed: {
            forward: 1.2,
            backward: 0.8,
            rotation: 2.0,
            jump: 1.3
        }
    }
}

export { Settings };