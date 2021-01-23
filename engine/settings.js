const Settings = {
    game: { 
        title: 'Sample Moon Game',
        width: 800, 
        height: 600, 
        domId: 'game',
        version: 'pre-alpha0' },
    camera: {
        position: { x:0, y:5, z:3 },
        plane: { near: 0.1, far: 30000 },
        fov: 50,
        distance: {min:4, max:12 },
        angle: {polar: Math.PI * 0.44}
    },
    environment: {
        background: 0x222222,
        fog: { enabled: false, color: 0x222222, near: 20, far: 1000 },
        sun: { color: 0xffffee, power: 1.4 },
        ambinet: 0x444444,
        sky: { skybox:  'purplenebula' }
    }
}

export { Settings };