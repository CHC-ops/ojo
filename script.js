function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);
    return `${date} ${time}`;
}

function populateTable(participants) {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = '';

    participants.forEach(participant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.date}</td>
            <td>${participant.name}</td>
            <td>${participant.numeral}</td>
            <td>${participant.playType}</td>
            <td>${participant.amount}</td>
            <td>${participant.pieces}</td>
        `;
        resultsTable.appendChild(row);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('aka').value;
    const numerals = document.getElementById('numerals').value.split(',');
    const amounts = document.getElementById('amounts').value.split(',');
    const pieces = document.getElementById('pieces').value.split(',');
    const playType = document.getElementById('playType').value;

    const newParticipants = numerals.map((numeral, index) => ({
        date: getCurrentDateTime(),
        name: name,
        numeral: numeral.trim(),
        playType: playType,
        amount: amounts[index] ? amounts[index].trim() : '',
        pieces: pieces[index] ? pieces[index].trim() : ''
    }));

    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    localStorage.setItem('participants', JSON.stringify([...participants, ...newParticipants]));

    populateTable([...participants, ...newParticipants]);
    document.getElementById('inputForm').reset();
}

function handleSearchSubmit(event) {
    event.preventDefault();

    const searchName = document.getElementById('searchName').value.toLowerCase();
    const searchNumeral = document.getElementById('search#').value;
    const searchPlayType = document.getElementById('searchPlayType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    const filteredParticipants = participants.filter(participant => {
        const participantDate = participant.date.split(' ')[0];

        if (searchPlayType === 'HideAll') {
            document.getElementById('resultsTableContainer').classList.add('hidden');
            return false;
        }

        return (!searchName || participant.name.toLowerCase().includes(searchName)) &&
            (!searchNumeral || participant.numeral.includes(searchNumeral)) &&
            (!searchPlayType || participant.playType === searchPlayType) &&
            (!startDate || participantDate >= startDate) &&
            (!endDate || participantDate <= endDate);
    });

    if (searchPlayType !== 'HideAll') {
        document.getElementById('resultsTableContainer').classList.remove('hidden');
        populateTable(filteredParticipants);
    }
}

function handleEraseHistory() {
    const accessPin = document.getElementById('accessPin').value;
    if (accessPin === '2024') {
        localStorage.removeItem('participants');
        populateTable([]);
        document.getElementById('accessPin').value = '';
    } else {
        alert('PIN de Acceso Incorrecto');
    }
}

function handleReset() {
    document.getElementById('searchForm').reset();
    document.getElementById('resultsTableContainer').classList.remove('hidden');
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    populateTable(participants);
}

function toggleSearchForm() {
    const searchFormContainer = document.getElementById('searchFormContainer');
    searchFormContainer.classList.toggle('hidden');
}

document.getElementById('inputForm').addEventListener('submit', handleFormSubmit);
document.getElementById('searchForm').addEventListener('submit', handleSearchSubmit);
document.getElementById('eraseHistoryButton').addEventListener('click', handleEraseHistory);
document.getElementById('resetButton').addEventListener('click', handleReset);
document.getElementById('toggleSearchForm').addEventListener('click', toggleSearchForm);

window.onload = function () {
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    populateTable(participants);
};