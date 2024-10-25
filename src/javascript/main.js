import SoundCard from "./classes/SoundCard.js";
import AppInterface from "./classes/AppInterface.js";



async function main() {
    const appInterface = new AppInterface({
        container: document.querySelector('.container'),
        tracks: [
            "media/beats/8-Bit (1).mp3",
            "media/beats/8-Bit (2).mp3",
            "media/beats/Rapsfx1.mp3",
            "media/beats/Rapsfx17.mp3"
        ]
    });
}

main();