class SoundCard {
    static drawWaveform = async (canvas, filePath, backgroundColor) => {
        const context = canvas.getContext('2d');
    
        const basename = filePath.split('/').pop();
        const filename = basename.split('.')[0];
    
        const audioBuffer = await this.loadTrack(filePath);
        const bufferLength = audioBuffer.length;
        const dataArray = audioBuffer.getChannelData(0);
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = backgroundColor;

        context.fillRect(0, 0, canvas.width, canvas.height);
    
        context.beginPath();
        context.strokeStyle = "white";
        for (let i = 0; i < bufferLength; i++) {
            const x = i / 100;
            const y = (1 + dataArray[i]) * 50;
            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
        context.stroke();
    }
    
    static loadTrack = async (filePath) => {
        let audioBuffer;
        try {
            const response = await fetch(filePath);
            const arrayBuffer = await response.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            return audioBuffer;
        } catch (error) {
            console.error('Error loading track:', error);
        }
    }

    static playTrack = async (filePath) => {
        const audioBuffer = await this.loadTrack(filePath);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        const duration = audioBuffer.duration;
        const startTime = audioContext.currentTime;
        console.log(startTime, duration);

        source.start();
    }
}

export default SoundCard;