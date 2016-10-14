/**
 * Created by quget on 13-9-16.
 */
class Keyboard
{
    constructor()
    {
        this.keyList = {};
        document.addEventListener("keydown",(e)=> {this.OnKeyDown(e);});
        document.addEventListener("keyup",(e)=> {this.OnKeyUp(e);});

    }
    OnKeyDown(e)
    {
        this.SetKey(e.key,true);
    }
    OnKeyUp(e)
    {
        this.SetKey(e.key,false);
    }
    SetKey(key,isPressed)
    {
        this.keyList[key] = isPressed;
    }
    GetKey(key)
    {
        return this.keyList[key];
    }
}
let keyboard = new Keyboard();//Uhm... ok
