import SoundCard from "./SoundCard.js";

class AppInterface {
    settings = {};
    defaultSettings = {
        cellWidth: 25,
        container: null,
        tracks: []
    };

    dragData = {
        track_path: '',
        rowIndex: 0,
        backgroundColor: 'black'
    };

    rowHeaders = [];

    playing = false;

    constructor(settings) {
        this.settings = Object.assign(this.defaultSettings, settings);
        if (!this.settings.container) {
            throw new Error("No container specified in settings.");
        }

        this.container = this.settings.container;
        console.log(this.settings);

        this.createRows();
        this.createInterface();
        this.createListeners();
    }

    static sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    createRows() {
        const tracks = this.settings.tracks;
        const container = this.container;

        for (let rowIndex = 0; rowIndex < tracks.length; rowIndex++) {
            const row = document.createElement('div');
            row.classList.add('row');
            row.id = `row-${rowIndex}`;
    
            const rowHeader = document.createElement('div');
            rowHeader.classList.add('rowHeader');
            rowHeader.id = `cell-${rowIndex}`;
            rowHeader.innerText = tracks[rowIndex];
            rowHeader.setAttribute('track', tracks[rowIndex]);
            rowHeader.setAttribute('backgroundColor', "blue");
            rowHeader.draggable = true;
            this.rowHeaders.push(rowHeader);
            row.appendChild(rowHeader);
    
            for (let columnIndex = 0; columnIndex < 32/6; columnIndex++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${rowIndex}-${columnIndex}`;
                cell.style.width = `${this.settings.cellWidth*6}px`;
                cell.setAttribute('row', rowIndex);
                cell.setAttribute('column', columnIndex);
                cell.setAttribute('attached', "false");
                cell.setAttribute("playing", "false");
    
                row.appendChild(cell);
            }
    
            container.appendChild(row);
        }
    }

    createInterface() {
        const playButton = document.createElement('div');
        playButton.classList.add('playButton');

        const span = document.createElement('span');
        span.innerText = 'Play';
        playButton.appendChild(span);

        this.container.appendChild(playButton);
    }

    createListeners() {
        this.container.querySelector('.playButton').addEventListener('click', async (event) => {
            if (!this.playing) {
                this.playing = true;
        
                console.log('play', event);
        
                // Get the total number of columns by checking the first row
                const numColumns = this.container.querySelectorAll(`#row-0 .cell`).length;
        
                // Iterate over each column
                for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                    // Collect all sounds in the current column to play them simultaneously
                    for (let rowIndex = 0; rowIndex < this.rowHeaders.length; rowIndex++) {
                        const cell = this.container.querySelector(`#cell-${rowIndex}-${columnIndex}`);
                        
                        // Check if the cell has an attached track
                        if (cell) {
                            const rowHeader = cell.parentNode.querySelector('.rowHeader');

                            const cells = this.container.querySelectorAll('.cell');
                            cells.forEach(cell => {
                                cell.setAttribute('playing', 'false');
                                if (cell.getAttribute('column') == columnIndex) {
                                    cell.setAttribute('playing', 'true');
                                }
                            });
                            
                            if (cell.getAttribute('attached') === "true" && rowHeader) {
                                const track_path = rowHeader.getAttribute('track');
                                SoundCard.playTrack(track_path); // Play the track
                            }
                        }
                    }
        
                    // Wait 1 second before moving to the next column
                    await AppInterface.sleep(1000);
                }
        
                this.playing = false; // Reset playing status after all columns have been played
            }
        });

        this.rowHeaders.forEach(rowHeader => {
            rowHeader.addEventListener('dragstart', (event) => {
                console.log('dragstart', event);
                const data = Object.assign(this.dragData, {
                    track_path: rowHeader.getAttribute('track'),
                    rowIndex: rowHeader.id.split('-')[1],
                    backgroundColor: rowHeader.backgroundColor
                });
                event.dataTransfer.setData("text", JSON.stringify(data));
            });
        });

        for (let rowIndex = 0; rowIndex < this.rowHeaders.length; rowIndex++) {
            const cells = this.container.querySelectorAll(`#row-${rowIndex} .cell`);
            cells.forEach(cell => {
                cell.addEventListener('dragover', (event) => {
                    console.log('dragover', event);
                    event.preventDefault();
                });

                cell.addEventListener('drop', (event) => {
                    console.log('drop', event);
                    event.preventDefault();
                    const data = JSON.parse(event.dataTransfer.getData("text"));

                    const div = document.createElement('div');
                    div.classList.add('waveform');

                    const canvas = document.createElement('canvas');
                    canvas.width = event.target.clientWidth;
                    canvas.height = event.target.clientHeight;

                    console.log(data)
                    SoundCard.drawWaveform(canvas, data.track_path, data.backgroundColor);

                    if (data.rowIndex != rowIndex) {
                        return;
                    }

                    if (event.target.getAttribute('attached') == "true") {
                        return;
                    }
                    
                    div.appendChild(canvas);
                    event.target.setAttribute('attached', "true");
                    event.target.appendChild(div);
                });
            });
        }
    }
}

export default AppInterface;