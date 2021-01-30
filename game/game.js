const MyGame = new SSEngine(Settings);

MyGame.MyLoop = () => {
    let deltaTime = MyGame.Clock.getDelta();
    MyGame.Renderer.render(MyGame.Scene, MyGame.Camera);

    
    MyGame.Box.rotation.x += MyGame.Box.RotateVector.x * deltaTime;
    MyGame.Box.rotation.y += MyGame.Box.RotateVector.y * deltaTime;

    document.title = `FPS: ${Math.round(1/deltaTime)}, dt: ${Math.round(deltaTime*10000)/10000}ms | ${Settings.game.title}`;
    requestAnimationFrame( MyGame.MyLoop );
}

MyGame.InitSampleScene = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0xffcc00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.MoveVector = {x:0,y:0,z:0};
    mesh.RotateVector = {x:0,y:0,z:0};
    MyGame.Box = mesh;
    MyGame.Scene.add(MyGame.Box);
}

MyGame.HandleClick = () => {
    MyGame.Box.RotateVector.x = MyGame.Box.RotateVector.x != 0 ? 0 : Math.random() * 4.0;
    MyGame.Box.RotateVector.y = MyGame.Box.RotateVector.y != 0 ? 0 : Math.random() * 4.0;
}

window.addEventListener('click', MyGame.HandleClick);

console.log(`GAME: Starting [${Settings.game.title}].`);
console.log(`GAME: Version [${Settings.game.version}].`);

MyGame.InitSampleScene();
MyGame.MyLoop();

MyGame.Moog({freq: 1000,attack: 80,decay: 400,oscilator: 0,vol: 0.2});
MyGame.Moog({freq: 400,attack: 200,decay: 500,oscilator: 0,vol: 0.2});
MyGame.Moog({freq: 500,attack: 200,decay: 1000,oscilator: 0,vol: 0.2});
