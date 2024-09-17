function createRows(container, rows, columns) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        container.appendChild(row);
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            row.appendChild(cell);
        }
    }
}

window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    createRows(container, 4, 16);
});