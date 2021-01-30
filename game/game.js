const MyGame = new SSEngine(Settings);

MyGame.MyLoop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Renderer.render(MyGame.Scene, MyGame.Camera);

    document.title = `FPS: ${Math.round(1/deltaTime)}, dt: ${Math.round(deltaTime*10000)/10000}ms | ${Settings.game.title}`;
    requestAnimationFrame( MyGame.MyLoop );
}

MyGame.InitSampleScene = () => {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshLambertMaterial({color: 0xffcc00});
    const mesh = new THREE.Mesh(geometry, material);
    MyGame.Scene.add(mesh);

}

console.log(`GAME: Starting [${Settings.game.title}].`);
console.log(`GAME: Version [${Settings.game.version}].`);

MyGame.InitSampleScene();
MyGame.MyLoop();


MyGame.Moog({freq: 1000,attack: 80,decay: 400,oscilator: 0,vol: 0.2});
MyGame.Moog({freq: 400,attack: 200,decay: 500,oscilator: 0,vol: 0.2});
MyGame.Moog({freq: 500,attack: 200,decay: 1000,oscilator: 0,vol: 0.2});
