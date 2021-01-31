class SSRenderer {
    constructor (settings) {
        this.Renderer = new THREE.WebGLRenderer( {antialias: true});
        console.log(" * RENDERER: Adding tonal mapping.");
        // Set CustomToneMapping to Uncharted2
        // source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
        THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
        );
        this.Renderer.setSize(settings.game.width, settings.game.height);
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Renderer.setClearColor( settings.environment.background );
        this.Renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.Renderer.toneMappingExposure = settings.environment.postprocess.exposure;

        console.log(" * RENDERER: Adding shadow map.");
        this.Renderer.shadowMap.enabled = true;
        this.Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.Renderer.outputEncoding = THREE.sRGBEncoding;

        document.body.appendChild(this.Renderer.domElement);
        console.log(" * RENDERER: Initialized.");
    }
}