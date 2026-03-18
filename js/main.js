let records = [];
let editIndex = null;

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
    if (!tbody)
        return;
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No records found.</td></tr>';
        return;
    }
    let html = '';
    records.forEach((r, i) => {
        html += `<tr>
            <td>${r.vehicle || ''}</td>
            <td>${r.reg || ''}</td>
            <td>${r.owner || ''}</td>
            <td>${r.mobile || ''}</td>
            <td>${r.mileage || ''}</td>
            <td>${r.date || ''}</td>
            <td>${r.parts || ''}</td>
            <td>${r.addInfo || ''}</td>
            <td>
                <button onclick="editRecord(${i})">Edit</button>
                <button onclick="deleteRecord(${i})">Delete</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;


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
            mileage: document.getElementById('mileage')?.value || '',
            parts: document.getElementById('parts')?.value || '',
            date: document.getElementById('serviceDate')?.value.trim() || '',
            addInfo: ''
        };

        if (!newRec.vehicle || !newRec.reg) {
            showToast('Vehicle Name and Registration No. are required!');
            return;
        }


        if (editIndex !== null) {
            records[editIndex] = newRec;
            editIndex = null;
            document.querySelector('.card-header h2').innerText = 'Add Vehicle Service Record';
            showToast('Record updated!');
        } else {
            records.push(newRec);
            showToast('Record added!');
        }
        renderTable();
        form.reset();
    });
}

function editRecord(index) {
    const r = records[index];
    document.getElementById('vehicleName').value = r.vehicle || '';
    document.getElementById('regNo').value = r.reg || '';
    document.getElementById('ownerName').value = r.owner || '';
    document.getElementById('mobile').value = r.mobile || '';
    document.getElementById('mileage').value = r.mileage || '';
    document.getElementById('serviceDate').value = r.date || '';
    document.getElementById('parts').value = r.parts || '';
    editIndex = index;
    document.querySelector('.card-header h2').innerText = 'Edit Vehicle Service Record';
    showSection('input');
}

function deleteRecord(index) {
    records.splice(index, 1);
    renderTable();
    showToast('Record Deleted');
}




function searchVehicle() {
 const regInput = document.getElementById('regNumber');
    const reg = regInput.value.trim();

    if (!reg) {
        showToast('Please enter a registration number');
        return;
    }

    const found = records.some(r => r.reg.toLowerCase() === reg.toLowerCase());

    if (found) {
        showToast('Vehicle found');
    } else {
        showToast('No vehicle found with this registration number');
    }
}

function saveVehicleInfo() {
    const regInput = document.getElementById('regNumber');
    const infoTextarea = document.getElementById('additionalInfo');
    const reg = regInput.value.trim();
    const info = infoTextarea.value.trim();

    if (!reg) {
        showToast('Please enter a registration number');
        return;
    }
    const index = records.findIndex(r => r.reg.toLowerCase() === reg.toLowerCase());
    if (index !== -1) {
        // Update additional info
        records[index].addInfo = info;
        renderTable();          
        showToast('Additional information saved');

    } else {
        showToast('No vehicle found with this registration number');
    }
}

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = 'toast show ';
        setTimeout(function () {
            toast.className = 'toast';
        }, 3000);
    }
