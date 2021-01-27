/**
 * P1X WEBGL GAME ENGINE
 * DEFAULT SETTINGS
 * 
 * CREATED: 23-01-2021
 */

const Settings = {
    game: { 
        title: 'Sample Moon Game',
        domId: 'game',
        version: 'alpha1',
        scene: 'moon_scene'
    },
    renderer: {
        width: 800, 
        height: 600, 
        postprocess: {
            bloom: {
                enabled: false,
                strength: 1,
                kernel: 25,
                sigma: 4,
                resolution: 256
            },
            film: {
                enabled: false,
                noise: 0.35,
                scanline: {
                    intensity: 0.025,
                    lines: 648
                },
                grayscale: false
            }
        }
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
    physics: {
        gravity: { x:1, y:2, z:1}
    }
}

export { Settings };