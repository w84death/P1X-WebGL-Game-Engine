const Settings = {
    game: { 
        title: 'Simple Game for Simple Engine',
        folder: 'game',
        version: 'pre-alpha0'
    },
    camera: {
        pos: {x:0, y:2, z:6 },
        follow: {
            smooth: 0.01, 
            box: { x:1.5, y:2 },
        },
        plane: { near: 0.1, far: 30000 },
        fov: 50,
        distance: {min:1, max:8 },
        angle: {polar: Math.PI * 0.44}
    },
    environment: {
        background: 0x222222,
        fog: { enabled: true, color: 0x666666, near: 6, far: 12 },
        sun: { color: 0xffffee, power: 1 },
        ambinet: 0x444444,
        sky: { skybox:  '' },
        postprocess: {
            exposure: 1.0
        }
    },
    physics: {
        gravity: { x:1, y:9.8, z:1}
    },
    player: {
        speed: {
            forward: 1.2,
            backward: 0.8,
            rotation: 2.0,
            jump: 1.2
        }
    }
}