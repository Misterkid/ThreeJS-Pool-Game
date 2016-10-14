class Mouse
{
    constructor(mainBall,camera)
    {
        this.minPower = 5;
        this.maxPower = 180;
        this.powerAdd = 10;
        this.power = 80;


        this.position = new THREE.Vector2(0,0);


        this.caster = new THREE.Raycaster();
        this.mainBall = mainBall;
        this.camera = camera;

        this.material = new THREE.LineBasicMaterial({color: 0xFF0000});
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -10, 0, 0 ), new THREE.Vector3( 0, 0, 0 ));
        this.line = new THREE.Line( geometry, this.material );

        this.canShoot = false;
        this.init = false;


    }
    Init()
    {
        this.OnShootEvent = new Event('onshoot');

        document.addEventListener('mousemove', (e)=>
        {
            this.OnMouseMove(e);
        }, false);

        document.addEventListener('mousedown', (e)=>
        {
            this.OnMouseDown(e);
        }, false);
        document.addEventListener('touchstart', (e)=>
        {
            this.OnMouseDown(e);
        }, false);//Mobile support

        document.addEventListener("mouseup", (e)=>
        {
            this.OnMouseUp(e);
        }, false);
        document.addEventListener("touchend", (e)=>
        {
            this.OnMouseUp(e);
        }, false);//Mobile support;

    }
    PowerUpDown()
    {
        if(this.power <= this.minPower || this.power >= this.maxPower)
            this.powerAdd = this.powerAdd* -1;

        this.power = this.power + this.powerAdd;
    }
    OnMouseMove(e)
    {
        e.preventDefault();
        this.position.x = (e.clientX / window.innerWidth) * 2 -1;
        this.position.y = -(e.clientY / window.innerHeight) * 2 +1;


    }
    OnMouseUp(e)
    {
        //this.isDown = false;
        this.canShoot = true;
    }
    OnMouseDown(e)
    {
        //this.isDown = true;
        //this.timer = setInterval(this.PowerUpDown,250);
       // this.timer = setInterval((e)=> {this.PowerUpDown(e);},5)
    }
    OnMouseRayUpdate(objects,camera)
    {
            //Raycast fun!
            this.caster.setFromCamera( this.position, camera );
            var collisions = this.caster.intersectObjects( objects );
            if(collisions[0] != null)
            {
                var point = new THREE.Vector3();
                point.x = collisions[0].point.x;
                point.y = collisions[0].point.y;
                point.z = 0;

                var dir = new THREE.Vector3();
                dir.subVectors(point,this.mainBall.position);
                dir.z = 0;
                dir.normalize();

                dir.multiplyScalar(-1);
                this.caster.set(this.mainBall.position,dir);
                var distance = Math.sqrt( ((this.mainBall.position.x - point.x) *(this.mainBall.position.x - point.x) )
                    + (this.mainBall.position.y - point.y) *(this.mainBall.position.y - point.y) );

                var collisions = this.caster.intersectObjects( objects );
                if(collisions[0] != null)
                {
                    var point2 = new THREE.Vector3();
                    point2.x = collisions[0].point.x;
                    point2.y = collisions[0].point.y;
                    point2.z = 0;

                    var reflectDir = new THREE.Vector3();
                    reflectDir.x = collisions[0].face.normal.x;
                    reflectDir.y = collisions[0].face.normal.y;
                    reflectDir.z = 0;
                    var point3 = new THREE.Vector3();
                    point3.copy(dir).normalize();
                    point3.reflect(reflectDir);

                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(point,this.mainBall.position,point2,new THREE.Vector3( point2.x + (point3.x * 10), point2.y + (point3.y * 10), 0 ));
                    this.line = new THREE.Line( geometry, this.material );

                }
                this.power = this.minPower + (distance * this.powerAdd);
                if(this.power > this.maxPower)
                    this.power = this.maxPower;

                this.power = Math.floor(this.power);
                dir.multiplyScalar(this.power);
                if(this.canShoot == true)
                {
                    this.mainBall.velocity = dir;
                    new OneShotAudio(audioSources.poolHit);
                    document.dispatchEvent(this.OnShootEvent);
                    this.canShoot = false;
                }

            }
        this.canShoot = false;
        //this.isDown = false;
    }
}
