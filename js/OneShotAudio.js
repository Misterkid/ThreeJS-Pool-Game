/**
 * Created by quget on 2-10-16.
 */
class OneShotAudio
{
    constructor(src)
    {
        this.audio = document.createElement('audio');
        this.audio.appendChild(src);
        this.audio.play();
    }

}