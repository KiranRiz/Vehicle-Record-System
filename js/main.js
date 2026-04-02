const API_BASE = '/api/records';
const USER_API = '/api/users';

let records = [];
let editIndex = null;

document.addEventListener('DOMContentLoaded', async function () {
    showSection('home');
    setupNavigation();
    await loadRecords();
    setupForm();
    await loadUsers();
    setupUserForm();
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
        if (!res.ok) throw new Error('Failed to load users');
        const users = await res.json();
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
      const res = await fetch(USER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        showToast('User added successfully!');
        form.reset();
        loadUsers(); // Refresh table
        showSection('userRecords'); // Show user records section
      } else {
        const error = await res.json().catch(() => ({}));
        showToast(error.error || 'Failed to add user');
      }
    } catch (err) {
      console.error(err);
      showToast('Error adding user');
    }
  });
}

async function editUser(userId) {
  try {
    const res = await fetch(`${USER_API}/${userId}`);
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();

    const newName = prompt('Edit User Name:', user.userName);
    if (newName === null) return;
    const newReg = prompt('Edit Registration No.:', user.userRegNo);
    if (newReg === null) return;
    const newMobile = prompt('Edit Mobile:', user.mobile);
    if (newMobile === null) return;
    const newDate = prompt('Edit Assignment Date (YYYY-MM-DD):', user.assignDate.substring(0,10));
    if (newDate === null) return;
    const newVehicle = prompt('Edit Assigned Vehicle Reg:', user.vehicleReg);
    if (newVehicle === null) return;

    const updateRes = await fetch(`${USER_API}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: newName,
        userRegNo: newReg,
        mobile: newMobile,
        assignDate: newDate,
        vehicleReg: newVehicle
      })
    });

    if (updateRes.ok) {
      showToast('User updated!');
      loadUsers();
    } else {
      showToast('Failed to update user');
    }
  } catch (err) {
    console.error(err);
    showToast('Error editing user');
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
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


function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = 'toast show ';
    setTimeout(function () {
        toast.className = 'toast';
    }, 3000);
}
