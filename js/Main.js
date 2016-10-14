/**
 * Created by quget on 13-9-16.
 */
//let keyboard = new Keyboard();
class Main
{
    constructor ()
    {
        //this.keyboard = new Keyboard();
        this.sceneRenderer = new SceneRenderer();
        this.sceneRenderer.CreateScene();
        this.start = false;
        this.loader = new THREE.TextureLoader();

        this.player1 = new Player("Player 1");
        this.player2 = new Player("Player 2");
        /*Resetable Variables */
        this.currentPlayersTurn = this.player1;
        $(".playerTurn").html(this.currentPlayersTurn.name);
        this.turnEnd = false;
        this.ballsStopped = true;
        this.ballInHole = false;
        this.playerShot = false;
        this.WhiteBallInHole = false;
        this.gameDone = false;

        this.balls = new Array();
        //this.balls[0] is main ball
        this.SpawnBall(0,-20,"BallCue.jpg",0);
        this.mouse = new Mouse(this.balls[0],this.sceneRenderer.camera);
        document.addEventListener("onshoot",(e)=> {this.OnShoot(e);});
        this.sceneRenderer.AddObject(this.mouse.line);

        this.SpawnAllBalls();

        /*Light */

        var light = new THREE.AmbientLight( 0xffffff,0.5);
        //light.castShadow = true;
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);


        var light = new THREE.PointLight(0x40ff00);
        light.castShadow = true;
        light.position.set( 0, 0, 5 );//.normalize();//?
        this.sceneRenderer.AddObject(light);

        var light = new THREE.SpotLight(0xffffff,0.25);
        light.castShadow = true;
        light.position.set( 0, 60, 80);//.normalize();//?
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 225;
       // var test = new THREE.CameraHelper( light.shadow.camera )
        //this.sceneRenderer.AddObject(test);
        this.sceneRenderer.AddObject(light);
        //SkyDome
        var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
        var material = new THREE.MeshBasicMaterial();
        material.map = this.loader.load("assets/textures/skydome02.jpg");
        var sky = new THREE.Mesh(skyGeo, material);
        var rot = (90 * Math.PI) /180;
        sky.rotateX(rot);
        sky.position.set(0,0,200);
        sky.material.side = THREE.BackSide;
        this.sceneRenderer.AddObject(sky);

        /*field*/
        this.fieldObjects = new Array();
        var geometry = new THREE.BoxGeometry(2,60,2);
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/wood.jpg");

        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,60,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(40,2,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,-30,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(40,2,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,30,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        //floor
        var floorHeight = 20;

        var geometry = new THREE.PlaneGeometry(250,250);
        var plane = new THREE.Mesh(geometry,material);
        plane.position.set(0,0,-floorHeight);
        plane.receiveShadow = true;
        plane.castShadow = true;
        this.sceneRenderer.AddObject(plane);
        this.fieldObjects.push(plane);

        //feets
        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,-30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,-30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);


        //pool floor
        var geometry = new THREE.BoxGeometry(40,60,1);
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/test.jpg");
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,0,-1);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        //Holes
        this.holeBalls = Array();
        this.SpawnHoleBall(18,28);
        this.SpawnHoleBall(-18,-28);
        this.SpawnHoleBall(18,-28);
        this.SpawnHoleBall(-18,28);
        this.SpawnHoleBall(18,0);
        this.SpawnHoleBall(-18,0);
        document.addEventListener("onballinhole",(e)=> {this.OnBallInHole(e);});



        //Both
        this.allObjects =  this.balls.concat(this.fieldObjects);
        //this.allObjects.splice(this.mouse.mainBall);
        //Events
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});

        $(".start").click("onStartClick",(e)=> {this.OnStartClick(e);});
        this.sceneRenderer.Render();

        var peopleTalking = document.createElement('audio');
        peopleTalking.appendChild(audioSources.peopleTalking);
        peopleTalking.volume = 0.3;
        peopleTalking.loop = true;
        peopleTalking.play();

    }
    OnBallInHole(e)
    {
        if(e.detail.ballNr == 0)
        {
            e.detail.position.set(0,-20,-20);
            e.detail.velocity.set(0,0,0);
            this.WhiteBallInHole = true;
            this.turnEnd = true;
            return;
        }
        if(e.detail.ballNr == 8)
        {
            if(this.HaveAllBallIn())
            {
               // console.log("Won");
                $(".playerTurn").html(this.currentPlayersTurn.name + " Won :D ! PARTY! Refresh!");

            }
            else
            {
               // console.log("Lost");
                $(".playerTurn").html(this.currentPlayersTurn.name + " Lost :( Go cry in corner Refresh!");

            }
            this.gameDone = true;
            this.Reset();

        }
        if(this.player1.ballSet == false || this.player2.ballSet == false )
        {
            if (e.detail.ballNr < 8)
            {
                this.player1.firstHalf = true;
            }
            else if(e.detail.ballNr > 8)
            {
                this.player2.firstHalf = true;
            }
            this.player1.ballSet = true;
            this.player2.ballSet = true;
        }
        if(e.detail.ballNr > 8 && this.currentPlayersTurn.firstHalf
        || e.detail.ballNr < 8 && !this.currentPlayersTurn.firstHalf)
        {
            this.turnEnd = true;
        }

        this.RemoveBall(e.detail);
        this.sceneRenderer.RemoveObject(e.detail);
        if(this.balls.length == 1)
        {
            console.log("win");
        }
        this.ballInHole = true;
    }
    OnRenderUpdate(e)
    {
        if(this.start == true  && !this.gameDone)
        {
            for (var i = 0; i < this.balls.length; i++)
            {
                this.balls[i].OnUpdate(e);

            }
            this.CameraControl();
            $(".speed").html("Power:" + this.mouse.power);

            if(this.ballsStopped)
            {
                if(this.playerShot)
                {
                    if(this.ballInHole == false)
                    {
                        this.turnEnd = true;
                    }
                    this.playerShot = false;
                }
                if((this.turnEnd))
                {
                    if (this.currentPlayersTurn == this.player1)
                        this.currentPlayersTurn = this.player2;
                    else
                        this.currentPlayersTurn = this.player1;

                    this.turnEnd = false;
                }
                if(this.WhiteBallInHole)
                {
                    this.balls[0].position.set(0,-20,0);
                    this.WhiteBallInHole = false;
                }
            }

            var text = "Turn: " + this.currentPlayersTurn.name;
            if(this.currentPlayersTurn.ballSet == true)
            {
                if (this.currentPlayersTurn.firstHalf == false)
                {
                    text = text + "\nShoot half balls";
                }
                else
                {
                    text = text + "\nShoot whole balls";
                }
            }
            else
            {
                text = text + "\nNo side picked";
            }
            $(".playerTurn").html(text);
        }

        if(keyboard.GetKey('b'))
        {
            this.start = false;
            $(".start").show();
        }
        if(keyboard.GetKey('r'))
        {
            this.Reset();
        }
    }
    OnCollisionUpdate(e)
    {
        if(this.start == true)
        {
            this.ballsStopped = true;
            for (var i = 0; i < this.balls.length; i++)
            {
                this.balls[i].CollisionUpdate(this.balls,this.fieldObjects);

                if(this.balls[i].velocity.x != 0 || this.balls[i].velocity.y !=0 || this.balls[i].velocity.z != 0)
                {
                    this.ballsStopped =  false;
                }
            }
            for(var i = 0; i < this.holeBalls.length; i++)
            {
                this.holeBalls[i].CollisionUpdate(this.balls);
            }

            if(this.ballsStopped == true)
            {
                this.sceneRenderer.RemoveObject(this.mouse.line);
                this.mouse.OnMouseRayUpdate(this.allObjects , this.sceneRenderer.camera);
                this.sceneRenderer.AddObject(this.mouse.line);
            }
        }
    }
    OnShoot(e)
    {
        this.ballInHole = false;
        this.playerShot = true;
        this.ballsStopped =  false;
    }
    CameraControl()
    {
        if(keyboard.GetKey('q') == true)
        {
            this.sceneRenderer.RotateLeftRight(50*DeltaTime);
        }
        if(keyboard.GetKey('e') == true)
        {
            this.sceneRenderer.RotateLeftRight(-50*DeltaTime);
        }
        if(keyboard.GetKey('a') == true)
        {
            this.sceneRenderer.camera.translateX(-25 * DeltaTime);
            //this.sceneRenderer.camera.rotateZ(-10 * DeltaTime);
            // this.Translate(-this.speed * DeltaTime,0,0);
        }
        if(keyboard.GetKey('d') == true)
        {
            this.sceneRenderer.camera.translateX(25 * DeltaTime);
            //this.sceneRenderer.camera.rotateZ(10 * DeltaTime);
            //this.Translate(this.speed * DeltaTime,0,0);
        }
        if(keyboard.GetKey('s') == true)
        {
            this.sceneRenderer.ForwardBackward(25 * DeltaTime);
        }
        if(keyboard.GetKey('w') == true)
        {
            this.sceneRenderer.ForwardBackward(-25 * DeltaTime);
        }
       // console.log(this.sceneRenderer.camera.position);
    }
    Reset()
    {
        this.currentPlayersTurn = this.player1;
        $(".playerTurn").html(this.currentPlayersTurn.name);

        this.turnEnd = false;
        this.ballsStopped = true;
        this.ballInHole = false;
        this.playerShot = false;
        this.WhiteBallInHole = false;
        this.gameDone = false;
        this.RemoveAllBalls();
        this.SpawnBall(0,-20,"BallCue.jpg",0);
        this.mouse.mainBall = this.balls[0];
        this.SpawnAllBalls();
        this.allObjects =  this.balls.concat(this.fieldObjects);
        this.start = false;
        $(".start").show();
        this.canShoot = false;
    }
    SpawnAllBalls()
    {
        var ballCount = 1;
        for(var i = 0; i < 5; i++)
        {
            var x = -4 + i * 2;
            var y = 4;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 4; i++)
        {
            var x = -3 + i * 2;
            var y = 2;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 3; i++)
        {
            var x = -2 + i * 2;
            var y = 0;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 2; i++)
        {
            var x = -1 + i * 2;
            var y = -2;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }

        var x =  0;
        var y = -4;
        this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
    }
    RemoveAllBalls()
    {
        for(var i = 0; i < this.balls.length; i++)
        {
            this.sceneRenderer.RemoveObject(this.balls[i]);
        }
        this.balls = new Array();
    }
    SpawnBall(x,y,textureName,ballNr)
    {
        var geometry = new THREE.SphereGeometry(1,12,12);//THREE.BoxGeometry(1,2,1);
        var material = new THREE.MeshPhongMaterial();
        //var color = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

        material.map = this.loader.load("assets/textures/" + textureName);

        var ball = new Ball(geometry,material);
        var ballPosZ = 0;
        ball.position.set(x,y, ballPosZ);
        ball.ballNr = ballNr;

        ball.receiveShadow = true;
        ball.castShadow = true;
        this.sceneRenderer.AddObject(ball);
        this.balls.push(ball);
    }
    SpawnHoleBall(x,y)
    {
        var geometry = new THREE.SphereGeometry(2,12,12);
        var material = new THREE.MeshLambertMaterial();
        material.color.setHex("0x000000");
        var holeBall = new HoleBall(geometry,material);
        holeBall.position.set(x,y,-1);
        // holeBall.addEventListener()
        this.sceneRenderer.AddObject(holeBall);
        this.holeBalls.push(holeBall);

    }
    HaveAllBallIn()
    {
        for(var i = 0; i < this.balls.length; i ++)
        {
            if(this.balls[i].ballNr < 8 && this.currentPlayersTurn.firstHalf
                || this.balls[i].ballNr > 8 && !this.currentPlayersTurn.firstHalf)
            {
                return false;
            }
        }
        return true;

    }
    RemoveBall(ball)
    {
        for(var i = 0; i < this.balls.length; i++)
        {
            if(this.balls[i] == ball)
            {
                this.balls.splice(i,1);
                break;
            }
        }
    }
    OnStartClick(e)
    {
        this.start = true;
        $(".start").hide();
        this.mouse.Init();
    }

}
new Main();

