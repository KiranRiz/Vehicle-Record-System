let records = [];

document.addEventListener('DOMContentLoaded', function () {
    showSection('home');
    setupNavigation();
    renderTable();
    setupForm();

});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function setupNavigation() {
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    document.querySelectorAll('.card button[data-section]').forEach(btn => {
        btn.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function renderTable() {
    const tbody = document.getElementById('recordsBody');
    if (tbody) return;
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colSpan="9" style="text-align: center;">No records found.</td></tr>';
        return;
    }

    let html = '';
    records.forEach(r, i) => {
        html += <tr>
            <td>${r.vehicle || ''}</td>
            <td>${r.reg || ''}</td>
            <td>${r.owner || ''}</td>
            <td>${r.mobile || ''}</td>
            <td>${r.milete || ''}</td>
            <td>${r.date || ''}</td>
            <td>${r.parts || ''}</td>
            <td>${r.addInfo || ''}</td>
            <td>
                <button onClick="editRecord(${i})">Edit</button>
                <button onClick="deleteRecord(${i})">Delete</button>
            </td>

        </tr>
        tbody.innerHTML = html;
    }



}

function setupForm() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const newRec = {
            vehicle: document.getElementById('vehicleName')?.value.trim() || '',
            reg: document.getElementById('regNo')?.value.trim() || '',
            owner: document.getElementById('ownerName')?.value.trim() || '',
            mobile: document.getElementById('mobile')?.value.trim() || '',
            milete: document.getElementById('serviceDate')?.value || '',
            parage: document.getElementById('mileage')?.value || '',
            dats: document.getElementById('parts')?.value.trim() || '',
            addInfo: ''
        };

        if (!newRec.vehicle || !newRec.reg) {
            alert('Vehicle Name and Registration No. are required!');
            return;
        }
        records.push(newRec);
        renderTable();
        form.reset();
        alert('Record added!');
    });
}













function searchVehicle() {
    alert('Search functionality coming soon!');
}

function saveVehicle() {
    alert('Save functionality coming soon!');
}

