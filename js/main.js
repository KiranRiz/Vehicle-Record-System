const API_BASE = '/api/records';
const USER_API = '/api/users';
const AGREEMENT_API = '/api/agreements';


let records = [];
let users = [];
let editIndex = null;
let editUserId = null;
let agreements = [];
let editAgreementId = null;

document.addEventListener('DOMContentLoaded', async function () {
    showSection('home');
    setupNavigation();
    await loadRecords();
    setupForm();
    await loadUsers();
    setupUserForm();
    await loadAgreements();
    setupAgreementForm();
    setupSearch();
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
            <td>${r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
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

async function loadRecords() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to load records');
        records = await res.json();
    } catch (err) {
        console.error(err);
        showToast('Unable to load records from server');
    }
    renderTable();
    updateVehicleDropdown();
}

async function addRecord(record) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error || 'Failed to save record';
        throw new Error(message);
    }

    return res.json();
}

function setupForm() {
    const form = document.getElementById('serviceForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
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
            try {
                const response = await fetch(`${API_BASE}/${records[editIndex]._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRec)
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.error || 'Failed to update record');
                }

                const updatedRecord = await response.json();
                records[editIndex] = updatedRecord;
                editIndex = null;
                document.querySelector('.card-header h2').innerText = 'Add Vehicle Service Record';
                showToast('Record updated!');
                updateVehicleDropdown();
                renderTable();
                form.reset();
                showSection('records');
            } catch (err) {
                console.error(err);
                showToast(err.message || 'Error updating record');
            }
            return;
        }

        try {
            const created = await addRecord(newRec);
            records.unshift(created);
            showToast('Record added!');
            updateVehicleDropdown();
            renderTable();
            form.reset();
            showSection('records');
        } catch (err) {
            console.error(err);
            showToast(err.message || 'Failed to save record');
        }
    });
}

function editRecord(index) {
    const r = records[index];
    document.getElementById('vehicleName').value = r.vehicle || '';
    document.getElementById('regNo').value = r.reg || '';
    document.getElementById('ownerName').value = r.owner || '';
    document.getElementById('mobile').value = r.mobile || '';
    document.getElementById('mileage').value = r.mileage || '';
    document.getElementById('serviceDate').value = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    document.getElementById('parts').value = r.parts || '';
    editIndex = index;
    document.querySelector('.card-header h2').innerText = 'Edit Vehicle Service Record';
    showSection('input');
}

async function deleteRecord(index) {
    const record = records[index];
    if (!record) return;

    try {
        const response = await fetch(`${API_BASE}/${record._id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to delete record');
        }

        records.splice(index, 1);
        renderTable();
        showToast('Record deleted successfully!');
    } catch (err) {
        console.error(err);
        showToast(err.message || 'Error deleting record');
    }
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


async function loadUsers() {
    try {
        const res = await fetch(USER_API);
        users = await res.json();
        if (!res.ok) throw new Error('Failed to load users');
        renderUserTable(users);
    } catch (err) {
        console.error(err);
        showToast('Unable to load users from server');
    }
}

function renderUserTable(users) {
    const tbody = document.getElementById('userRecordsBody');
    if (!tbody) return;
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No records found</td></tr>';
        return;
    }
    let html = '';
    users.forEach((u, i) => {
        html += `
      <tr>
        <td>${u.userName}</td>
        <td>${u.userRegNo}</td>
        <td>${u.mobile}</td>
        <td>${new Date(u.assignDate).toLocaleDateString()}</td>
        <td>${u.vehicleReg}</td>
        <td>
          <button onclick="editUser('${u._id}')">Edit</button>
          <button onclick="deleteUser('${u._id}')">Delete</button>
        </td>
      </tr>
    `;
    });
    tbody.innerHTML = html;
}


function setupUserForm() {
    const form = document.getElementById('userForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            userName: document.getElementById('userName').value.trim(),
            userRegNo: document.getElementById('userRegNo').value.trim(),
            mobile: document.getElementById('userMobile').value.trim(),
            assignDate: document.getElementById('assignDate').value,
            vehicleReg: document.getElementById('AssignvahicleReg').value.trim()
        };

        if (!userData.userName || !userData.userRegNo || !userData.mobile || !userData.assignDate || !userData.vehicleReg) {
            showToast('All fields are required!');
            return;
        }

        try {
            let res;
            if (editUserId !== null) {
                // UPDATE existing user
                res = await fetch(`${USER_API}/${editUserId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                if (res.ok) {
                    showToast('User updated successfully!');
                    editUserId = null;
                    // Reset form header and button text
                    document.querySelector('#users .card-header h2').innerText = 'Add User Record';
                    const submitBtn = document.querySelector('#userForm button[type="submit"]');
                    if (submitBtn) submitBtn.innerText = 'Add user';
                }
            } else {
                // CREATE new user
                res = await fetch(USER_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                if (res.ok) showToast('User added successfully!');
            }

            if (res.ok) {
                form.reset();
                await loadUsers();
                showSection('userRecords');
            } else {
                const error = await res.json().catch(() => ({}));
                showToast(error.error || 'Operation failed');
            }
        } catch (err) {
            console.error(err);
            showToast('Error saving user');
        }
    });
}

async function editUser(userId) {
    try {
        const res = await fetch(`${USER_API}/${userId}`);
        if (!res.ok) throw new Error('User not found');
        const user = await res.json();

        // Populate the user form
        document.getElementById('userName').value = user.userName;
        document.getElementById('userRegNo').value = user.userRegNo;
        document.getElementById('userMobile').value = user.mobile;
        document.getElementById('assignDate').value = user.assignDate.substring(0, 10);
        document.getElementById('AssignvahicleReg').value = user.vehicleReg;


        editUserId = userId;
        document.querySelector('#users .card-header h2').innerText = 'Edit User Record';


        showSection('users');


        const submitBtn = document.querySelector('#userForm button[type="submit"]');
        if (submitBtn) submitBtn.innerText = 'Update User';
    } catch (err) {
        console.error(err);
        showToast('Error loading user data');
    }
}

async function deleteUser(userId) {
    try {
        const res = await fetch(`${USER_API}/${userId}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('User deleted');
            loadUsers();
        } else {
            showToast('Failed to delete user');
        }
    } catch (err) {
        console.error(err);
        showToast('Error deleting user');
    }
}

function updateVehicleDropdown() {
    const selectBox = document.getElementById('AssignvahicleReg');
    if (!selectBox) return;

    selectBox.innerHTML = '<option value="">-- Select a vehicle --</option>';

    const allRegs = records.map(r => r.reg);
    const uniqueRegs = [...new Set(allRegs)];

    uniqueRegs.forEach(reg => {
        const option = document.createElement('option');
        option.value = reg;
        option.textContent = reg;
        selectBox.appendChild(option);
    });
}

function setupSearch() {
    const setup = (searchId, tableId, colIndex = 1) => {
        const input = document.getElementById(searchId);
        if (!input) return;
        input.addEventListener('keyup', function () {
            const term = this.value.trim().toLowerCase();
            const rows = document.querySelectorAll(`#${tableId} tbody tr`);
            rows.forEach(row => {
                const cell = row.cells[colIndex];
                const match = cell && cell.textContent.toLowerCase().includes(term);
                row.style.display = (!term || match) ? '' : 'none';
                row.classList.toggle('highlight-row', match && term !== '');
            });
        });
    };
    setup('searchServiceRecords', 'recordsTable');
    setup('searchUserRecords', 'userRecordTable');
}


function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = 'toast show ';
    setTimeout(function () {
        toast.className = 'toast';
    }, 3000);
}

function exportToCSV(type) {
    let data, filename, customHeaders, fieldMapping;

    if (type === 'records') {
        data = records;
        filename = 'service_records.csv';
        // Custom headings aur mapping
        customHeaders = ['Vehicle Name', 'Registration No.', 'Owner Name', 'Mobile No.', 'Mileage (km)', 'Service Date', 'Parts Changed', 'Additional Info'];
        fieldMapping = ['vehicle', 'reg', 'owner', 'mobile', 'mileage', 'date', 'parts', 'addInfo'];
    } else {
        data = users;
        filename = 'user_records.csv';
        customHeaders = ['User Name', 'Registration No.', 'Mobile No.', 'Assignment Date', 'Assigned Vehicle'];
        fieldMapping = ['userName', 'userRegNo', 'mobile', 'assignDate', 'vehicleReg'];
    }

    if (!data.length) return showToast('No data to export');

    // Rows banao mapping ke hisaab se
    const rows = data.map(row => {
        return fieldMapping.map(field => {
            let value = row[field];
            if (field === 'date' || field === 'assignDate') {
                value = value ? new Date(value).toLocaleDateString() : '';
            }
            return `"${value || ''}"`;
        }).join(',');
    });

    const csv = [customHeaders.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}


// Agreement related functions
async function loadAgreements() {
    try {
        const res = await fetch('/api/agreements');
        if (!res.ok) throw new Error('Failed to load');
        agreements = await res.json();
        renderAgreementTable();
    } catch (err) {
        showToast('Error loading agreements');
    }
}

function renderAgreementTable() {
    const tbody = document.getElementById('agreementListBody');
    if (!tbody) return;
    if (agreements.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No agreements found</td></tr>';
        return;
    }
    let html = '';
    agreements.forEach(ag => {
        html += `
      <tr>
        <td>${new Date(ag.startDate).toLocaleDateString()}</td>
        <td>${new Date(ag.endDate).toLocaleDateString()}</td>
        <td>${ag.seatingCapacity}</td>
        <td>${ag.fareType}</td>
        <td>
          <button onclick="editAgreement('${ag._id}')">Edit</button>
          <button onclick="deleteAgreement('${ag._id}')">Delete</button>
        </td>
      </tr>
    `;
    });
    tbody.innerHTML = html;
}