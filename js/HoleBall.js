/**
 * Created by quget on 5-10-16.
 */
class HoleBall extends THREE.Mesh
{
    constructor(geometry,material)
    {
        super(geometry,material);
        this.radius = geometry.parameters.radius;
       // this.OnBallInHole = new Event('onballinhole');

    }
    CollisionUpdate(objects)
    {
        for(var i = 0; i < objects.length; i++)
        {
            if(objects[i].geometry != null && objects[i] != this)
            {
                if (this.position.x + this.radius + objects[i].radius > objects[i].position.x
                    && this.position.x < objects[i].position.x + this.radius + objects[i].radius
                    && this.position.y + this.radius + objects[i].radius > objects[i].position.y
                    && this.position.y < objects[i].position.y + this.radius + objects[i].radius)
                {
                    var distance = Math.sqrt( ((this.position.x - objects[i].position.x) *(this.position.x - objects[i].position.x) )
                        + (this.position.y - objects[i].position.y) *(this.position.y - objects[i].position.y) );
                    if (distance < this.radius + objects[i].radius)
                    {
                        console.log("hole");
                        //this.OnBallInHole.detail.set(objects[i]);
                        this.OnBallInHole = new CustomEvent('onballinhole', { 'detail': objects[i] });
                        document.dispatchEvent(this.OnBallInHole);
                    }

                }
            }
        }
    }
}