
// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================

const SUPABASE_URL = 'https://xhcchfehqafmovietgom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fdnykftr9iBH2pEZFeuH6g_YS5qzYAU';
const supabase = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ==========================================
// ESTADO LOCAL (Cache)
// ==========================================

const store = {
    brokers: [],
    vendors: [],
    procedures: [],
    session: null
};

// ==========================================
// NAVEGACIÓN Y VISTAS
// ==========================================

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update Nav
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update View
        const viewId = `view-${btn.dataset.view}`;
        document.querySelectorAll('.view-container').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
        document.getElementById(viewId).classList.add('active');

        // Refresh Data if needed
        if (btn.dataset.view === 'vendors') renderVendors();
        if (btn.dataset.view === 'procedures') renderProcedures();
    });
});

// ==========================================
// DATA FETCHING (SUPABASE)
// ==========================================

async function loadData() {
    if (!supabase) return;

    // Load Vendors
    const { data: vendors, error: errV } = await supabase.from('vendors').select('*');
    if (vendors) store.vendors = vendors;

    // Load Procedures
    const { data: procedures, error: errP } = await supabase.from('procedures').select('*');
    if (procedures) store.procedures = procedures;

    // Load Brokers
    const { data: brokers, error: errB } = await supabase.from('brokers').select('*');
    if (brokers) store.brokers = brokers;

    if (errV || errP || errB) console.error("Error loading data:", errV, errP, errB);

    renderDashboard();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    if (type === 'error') toast.style.backgroundColor = 'var(--danger)';
    if (type === 'success') toast.style.backgroundColor = 'var(--success)';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// VENDORS LOGIC
// ==========================================

function renderVendors() {
    const container = document.getElementById('vendors-list');
    container.innerHTML = '';
    const filter = document.getElementById('search-vendor').value.toLowerCase();

    store.vendors.forEach(v => {
        if (!v.name.toLowerCase().includes(filter)) return;

        const card = document.createElement('div');
        card.className = 'vendor-card';
        card.innerHTML = `
            <div class="vendor-header">
                <span class="vendor-title">${v.name}</span>
                ${v.category ? `<span class="vendor-category">${v.category}</span>` : ''}
            </div>
            <div class="card-details">
                ${v.contact_info ? `✉️ ${v.contact_info}<br>` : ''}
                ${v.website ? `🌐 <a href="${v.website}" target="_blank">Web</a>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('add-vendor-btn').addEventListener('click', () => {
    document.getElementById('vendor-form').reset();
    document.getElementById('vendor-modal').classList.remove('hidden');
});

document.getElementById('vendor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('vendor-name').value;
    const category = document.getElementById('vendor-category').value;
    const contact_info = document.getElementById('vendor-contact').value;
    const website = document.getElementById('vendor-website').value;

    const { data, error } = await supabase.from('vendors').insert([{ name, category, contact_info, website }]).select();

    if (!error) {
        store.vendors.push(data[0]);
        renderVendors();
        document.getElementById('vendor-modal').classList.add('hidden');
        showToast('Vendedor creado', 'success');
    } else {
        showToast('Error al crear vendedor', 'error');
    }
});

document.getElementById('search-vendor').addEventListener('input', renderVendors);

// ==========================================
// PROCEDURES LOGIC
// ==========================================

function renderProcedures() {
    const container = document.getElementById('procedures-list');
    container.innerHTML = '';
    const filter = document.getElementById('search-procedure').value.toLowerCase();
    const filterVendor = document.getElementById('filter-procedure-vendor').value;

    store.procedures.forEach(p => {
        if (!p.title.toLowerCase().includes(filter)) return;
        if (filterVendor !== 'all' && p.vendor_id !== filterVendor) return;

        const vendor = store.vendors.find(v => v.id === p.vendor_id) || { name: 'Desconocido' };

        const card = document.createElement('div');
        card.className = 'procedure-card';
        card.innerHTML = `
            <div class="proc-meta">🏢 ${vendor.name}</div>
            <div class="card-title">${p.title}</div>
            <div class="card-details">${p.content ? p.content.substring(0, 100) + '...' : ''}</div>
        `;
        container.appendChild(card);
    });

    // Update Filter Options
    const select = document.getElementById('filter-procedure-vendor');
    if (select.children.length === 1) { // Only 'all' exists
        store.vendors.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.innerText = v.name;
            select.appendChild(opt);
        });

        // Update Modal Select as well
        const modalSelect = document.getElementById('proc-vendor');
        modalSelect.innerHTML = '<option value="">Selecciona un vendedor...</option>';
        store.vendors.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.innerText = v.name;
            modalSelect.appendChild(opt);
        });
    }
}

document.getElementById('add-procedure-btn').addEventListener('click', () => {
    document.getElementById('procedure-form').reset();
    document.getElementById('procedure-modal').classList.remove('hidden');
});

document.getElementById('procedure-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('proc-title').value;
    const vendor_id = document.getElementById('proc-vendor').value;
    const content = document.getElementById('proc-content').value;

    const { data, error } = await supabase.from('procedures').insert([{ title, vendor_id, content }]).select();

    if (!error) {
        store.procedures.push(data[0]);
        renderProcedures();
        document.getElementById('procedure-modal').classList.add('hidden');
        showToast('Procedimiento creado', 'success');
    } else {
        showToast('Error al crear procedimiento', 'error');
    }
});

document.getElementById('search-procedure').addEventListener('input', renderProcedures);
document.getElementById('filter-procedure-vendor').addEventListener('change', renderProcedures);


// ==========================================
// DASHBOARD & BROKERS LOGIC
// ==========================================

function renderDashboard() {
    renderStats();
    renderBoard();
}

function renderStats() {
    const total = store.brokers.length;
    document.getElementById('total-brokers').innerText = total;

    const counts = { nuevo: 0, contactado: 0, procedimientos: 0, cerrado: 0, perdido: 0 };
    store.brokers.forEach(c => {
        if (counts[c.status] !== undefined) counts[c.status]++;
    });

    for (const [key, val] of Object.entries(counts)) {
        const el = document.getElementById(`count-${key}`);
        if (el) el.innerText = val;
    }
}

function renderBoard() {
    const filterText = document.getElementById('search-input').value.toLowerCase();
    const filterStatus = document.getElementById('filter-status').value;

    ['nuevo', 'contactado', 'procedimientos', 'cerrado', 'perdido'].forEach(status => {
        document.getElementById(`list-${status}`).innerHTML = '';
    });

    store.brokers.forEach(broker => {
        if (filterStatus !== 'all' && broker.status !== filterStatus) return;
        const textMatch = broker.name.toLowerCase().includes(filterText) ||
            (broker.company && broker.company.toLowerCase().includes(filterText));
        if (!textMatch) return;

        const card = document.createElement('div');
        card.className = 'broker-card';
        card.draggable = true;
        card.ondragstart = (e) => drag(e);
        card.id = broker.id;

        card.innerHTML = `
            <div class="card-title">${broker.name}</div>
            <span class="card-company">${broker.company || ''}</span>
            <div class="card-details">
                ${broker.email ? '📧 ' + broker.email + '<br>' : ''}
                ${broker.whatsapp ? '📱 ' + broker.whatsapp : ''}
            </div>
            <div class="card-actions">
                <button class="icon-btn edit-btn" onclick="openEditModal('${broker.id}')">✏️</button>
                <button class="icon-btn delete-btn" onclick="openDeleteModal('${broker.id}')">🗑️</button>
            </div>
        `;

        const col = document.getElementById(`list-${broker.status}`);
        if (col) col.appendChild(card);
    });
}

// Filtros
document.getElementById('search-input').addEventListener('input', renderBoard);
document.getElementById('filter-status').addEventListener('change', renderBoard);

// Modales Brokers
const brokerModal = document.getElementById('broker-modal');
const deleteModal = document.getElementById('delete-modal');

document.getElementById('add-broker-btn').addEventListener('click', () => {
    document.getElementById('broker-form').reset();
    document.getElementById('broker-id').value = '';
    document.getElementById('modal-title').innerText = 'Nuevo Broker';
    brokerModal.classList.remove('hidden');
});

document.querySelectorAll('.close-modal, .close-modal-btn, #cancel-broker-btn, #cancel-delete-btn').forEach(el => {
    el.addEventListener('click', () => {
        brokerModal.classList.add('hidden');
        deleteModal.classList.add('hidden');
        document.getElementById('vendor-modal').classList.add('hidden');
        document.getElementById('procedure-modal').classList.add('hidden');
    });
});

document.getElementById('broker-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('broker-id').value;
    const name = document.getElementById('broker-name').value;
    const company = document.getElementById('broker-company').value;
    const email = document.getElementById('broker-email').value;
    const whatsapp = document.getElementById('broker-whatsapp').value;
    const status = document.getElementById('broker-status').value;
    const notes = document.getElementById('broker-notes').value;

    const brokerData = { name, company, email, whatsapp, status, notes };

    if (id) {
        // Editar
        const { error } = await supabase.from('brokers').update(brokerData).eq('id', id);
        if (!error) {
            const index = store.brokers.findIndex(c => c.id === id);
            store.brokers[index] = { ...store.brokers[index], ...brokerData };
            showToast('Broker actualizado', 'success');
        }
    } else {
        // Crear
        const { data, error } = await supabase.from('brokers').insert([brokerData]).select();
        if (!error) {
            store.brokers.push(data[0]);
            showToast('Broker creado', 'success');
        }
    }

    renderDashboard();
    brokerModal.classList.add('hidden');
});

window.openEditModal = (id) => {
    const broker = store.brokers.find(c => c.id === id);
    if (!broker) return;
    document.getElementById('broker-id').value = broker.id;
    document.getElementById('broker-name').value = broker.name;
    document.getElementById('broker-company').value = broker.company || '';
    document.getElementById('broker-email').value = broker.email || '';
    document.getElementById('broker-whatsapp').value = broker.whatsapp || '';
    document.getElementById('broker-status').value = broker.status;
    document.getElementById('broker-notes').value = broker.notes || '';
    document.getElementById('modal-title').innerText = 'Editar Broker';
    brokerModal.classList.remove('hidden');
};

let brokerToDeleteId = null;
window.openDeleteModal = (id) => {
    brokerToDeleteId = id;
    deleteModal.classList.remove('hidden');
};

document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    if (brokerToDeleteId) {
        const { error } = await supabase.from('brokers').delete().eq('id', brokerToDeleteId);
        if (!error) {
            store.brokers = store.brokers.filter(c => c.id !== brokerToDeleteId);
            renderDashboard();
            showToast('Broker eliminado', 'info');
        }
    }
    deleteModal.classList.add('hidden');
});

// Drag and Drop
window.allowDrop = (ev) => ev.preventDefault();
window.drag = (ev) => ev.dataTransfer.setData("text", ev.target.id);
window.drop = async (ev) => {
    ev.preventDefault();
    const brokerId = ev.dataTransfer.getData("text");
    const column = ev.target.closest('.column');

    if (column && brokerId) {
        const newStatus = column.dataset.status;
        const broker = store.brokers.find(c => c.id === brokerId);

        if (broker && broker.status !== newStatus) {
            broker.status = newStatus;
            renderDashboard(); // Optimistic update

            const { error } = await supabase.from('brokers').update({ status: newStatus }).eq('id', brokerId);
            if (error) {
                // Revert if error
                console.error(error);
                broker.status = oldStatus; // Need to track old status
                renderDashboard();
            } else {
                showToast(`Broker movido a ${newStatus}`, 'success');
            }
        }
    }
}

// ==========================================
// INIT
// ==========================================

loadData();
