/*
*
*   sound generation
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Moog = function(){
    this.audio = new (window.AudioContext || window.webkitAudioContext)();
};
Moog.prototype.play = function(params){
    if(params.pause) return;
    var vol = params.vol || 0.2,
        attack = params.attack || 20,
        decay = params.decay || 300,
        freq = params.freq || 30,
        oscilator = params.oscilator || 0;
        gain = this.audio.createGain(),
        osc = this.audio.createOscillator();

    // GAIN
    gain.connect(this.audio.destination);
    gain.gain.setValueAtTime(0, this.audio.currentTime);
    gain.gain.linearRampToValueAtTime(params.vol, this.audio.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, this.audio.currentTime + decay / 1000);

    // OSC
    osc.frequency.value = freq;
    osc.type = oscilator; //"square";
    osc.connect(gain);

    // START
    osc.start(0);

    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(game.moog.audio.destination);
    }, decay)
};