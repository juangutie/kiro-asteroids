let ac;

function resume() {
    if (!ac) ac = new AudioContext();
    if (ac.state === 'suspended') ac.resume();
}

function shoot() {
    resume();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.8);
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(1.62, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.start(t); osc.stop(t + 0.8);
}

function thrust(speed) {
    resume();
    const MAX_SPEED = 12;
    const intensity = Math.min(speed / MAX_SPEED, 1);
    const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    src.buffer = buf;
    filter.type = 'lowpass'; filter.frequency.value = 180;
    src.connect(filter); filter.connect(gain); gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.3 + intensity * 2.62, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
    src.start();
}

function collision() {
    resume();
    const t = ac.currentTime;

    // sub-bass thud — pitched sine dropping fast
    const osc = ac.createOscillator();
    const oscGain = ac.createGain();
    osc.connect(oscGain); oscGain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.4);
    oscGain.gain.setValueAtTime(3.0, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.4);

    // deep rumble body
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    src.buffer = buf;
    filter.type = 'lowpass'; filter.frequency.value = 60;
    src.connect(filter); filter.connect(gain); gain.connect(ac.destination);
    gain.gain.setValueAtTime(4.0, t);
    gain.gain.setValueAtTime(3.5, t + 0.6);
    gain.gain.linearRampToValueAtTime(0.0, t + 2.0);
    src.start(t);
}

export default { shoot, thrust, collision };
