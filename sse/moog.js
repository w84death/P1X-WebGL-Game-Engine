class SSMoog {
    constructor(){
        this.Audio = new (window.AudioContext || window.webkitAudioContext)();
        
        console.log("AUDIO: Moog audio initialized.");
    }

    Moog = (params) => {
        var vol = params.vol || 0.2,
            attack = params.attack || 20,
            decay = params.decay || 300,
            freq = params.freq || 30,
            oscilator = params.oscilator || 0,
            gain = this.Audio.createGain(),
            osc = this.Audio.createOscillator();

        // GAIN
        gain.connect(this.Audio.destination);
        gain.gain.setValueAtTime(0, this.Audio.currentTime);
        gain.gain.linearRampToValueAtTime(params.vol, this.Audio.currentTime + attack / 1000);
        gain.gain.linearRampToValueAtTime(0, this.Audio.currentTime + decay / 1000);

        // OSC
        osc.frequency.value = freq;
        osc.type = oscilator;
        osc.connect(gain);

        // START
        osc.start(0);

        setTimeout(function() {
            osc.stop(0);
            osc.disconnect(gain);
            gain.disconnect(this.Audio.destination);
        }, decay)
    };
}