/**
 * Created by quget on 2-10-16.
 */
class AudioSources
{
    constructor()
    {
        this.poolHit = document.createElement('source');
        this.poolHit.src = 'assets/sound/poolHit.wav';

        this.peopleTalking = document.createElement('source');
        this.peopleTalking.src = 'assets/sound/peopleTalking1.wav';
    }
}
let audioSources = new AudioSources();