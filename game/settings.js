const Settings = {
    game: { 
        title: 'Simple Game for Simple Engine',
        folder: 'game',
        version: 'pre-alpha0'
    },
    camera: {
        pos: {x:0, y:2, z:-8 },
        follow: {
            smooth: 0.01, 
            box: { x:1.5, y:2 },
        },
        plane: { near: 0.1, far: 30000 },
        fov: 40,
        distance: {min:1, max:8 },
        angle: {polar: Math.PI * 0.44}
    },
    environment: {
        background: 0xdddbe1,
        fog: { 
            enabled: true, 
            color: 0xdddbe1, 
            near: 10, 
            far: 0},
        sun: { color: 0xffffee, power: 1 },
        ambinet: 0x444444,
        sky: { skybox:  '' },
        postprocess: {
            exposure: 1.0
        }
    },
    physics: {
        gravity: { x:.1, y:9.8, z:1},
        rotation: { x:1, y:5.5, z:1 }
    },
    road: {
        blocks: 24,
        size: {x:10, y:0, z: 10},
        speed: {max: 64}
    },
    player: {
        speed: {
            forward: .5,
            side: 0.1,
            backward: 0.8,
            rotation: 2.0,
            jump: 1.2
        },
        rotation: {x: 0, y:0.3, z:0}
    }
}