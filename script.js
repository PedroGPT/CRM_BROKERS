
// ==========================================
// ESTADO Y CONFIGURACIÓN
// ==========================================

const store = {
    brokers: [],
    config: {
        password: null // Se guardará hasheada (simple)
    },
    session: {
        active: false,
        lastLogin: null
    }
};

const DB_KEY = 'mini_crm_data';

// ==========================================
// UTILIDADES Y PERSISTENCIA
// ==========================================

// Simple hash para no guardar la password en texto plano (Basic Security)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

function saveData() {
    localStorage.setItem(DB_KEY, JSON.stringify(store));
}

function loadData() {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            store.brokers = parsed.brokers || parsed.clients || [];
            store.config = parsed.config || { password: null };
            store.session = parsed.session || { active: false, lastLogin: null };

            // MIGRATION: Propuesta -> Procedimientos
            store.brokers.forEach(broker => {
                if (broker.status === 'propuesta') {
                    broker.status = 'procedimientos';
                }
            });
        }
    } catch (e) {
        console.error("Error loading data", e);
        // Reset defaults if corrupted
        store.brokers = [];
        store.config = { password: null };
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    if (type === 'error') toast.style.backgroundColor = 'var(--danger)';
    if (type === 'success') toast.style.backgroundColor = 'var(--success)';
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==========================================
// AUTENTICACIÓN
// ==========================================

function initAuth() {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    const authTitle = document.getElementById('auth-title');
    const authMessage = document.getElementById('auth-message');
    const authBtn = document.getElementById('auth-btn');
    const oldPassGroup = document.getElementById('old-password-group');
    const passwordInput = document.getElementById('password-input');

    // Comprobar estado de autenticación
    if (store.session.active) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        renderDashboard();
        return;
    }

    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    oldPassGroup.classList.add('hidden');

    if (!store.config.password) {
        // Primera vez: Configurar contraseña
        authTitle.innerText = "Bienvenido al CRM";
        authMessage.innerText = "Configura tu contraseña de acceso para empezar.";
        authBtn.innerText = "Guardar Contraseña";
        authBtn.dataset.action = 'setup';
    } else {
        // Login normal
        authTitle.innerText = "Iniciar Sesión";
        authMessage.innerText = "Introduce tu contraseña para continuar.";
        authBtn.innerText = "Entrar";
        authBtn.dataset.action = 'login';
        passwordInput.value = '';
    }
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password-input');
    const pass = passwordInput.value;
    const btn = document.getElementById('auth-btn');
    const action = btn.dataset.action;

    if (!pass) return;

    if (action === 'setup') {
        store.config.password = simpleHash(pass);
        store.session.active = true;
        store.session.lastLogin = new Date().toISOString();
        saveData();
        showToast('Contraseña guardada correctamente', 'success');
        initAuth();
    } else if (action === 'login') {
        if (simpleHash(pass) === store.config.password) {
            store.session.active = true;
            store.session.lastLogin = new Date().toISOString();
            saveData();
            initAuth();
        } else {
            showToast('Contraseña incorrecta', 'error');
            passwordInput.value = '';
        }
    } else if (action === 'change') {
        const oldPassInput = document.getElementById('old-password-input');
        const oldPass = oldPassInput.value;

        if (simpleHash(oldPass) === store.config.password) {
            store.config.password = simpleHash(pass);
            saveData();
            showToast('Contraseña actualizada', 'success');
            // Reset UI form to login/hidden state
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('app-section').classList.remove('hidden');
        } else {
            showToast('La contraseña actual no es correcta', 'error');
        }
    }
});

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    store.session.active = false;
    saveData();
    // Limpiar UI
    document.getElementById('user-menu').classList.add('hidden');
    initAuth();
});

document.getElementById('user-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    const menu = document.getElementById('user-menu');
    if (!menu.classList.contains('hidden')) menu.classList.add('hidden');
});

document.getElementById('change-pass-btn').addEventListener('click', (e) => {
    e.preventDefault();
    // Reutilizamos el formulario de auth para cambiar contraseña
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    const authTitle = document.getElementById('auth-title');
    const authMessage = document.getElementById('auth-message');
    const authBtn = document.getElementById('auth-btn');
    const oldPassGroup = document.getElementById('old-password-group');
    const passwordInput = document.getElementById('password-input');
    const oldPassInput = document.getElementById('old-password-input');

    appSection.classList.add('hidden');
    authSection.classList.remove('hidden');

    authTitle.innerText = "Cambiar Contraseña";
    authMessage.innerText = "Introduce tu contraseña actual y la nueva.";
    authBtn.innerText = "Actualizar";
    authBtn.dataset.action = 'change';

    oldPassGroup.classList.remove('hidden');
    passwordInput.value = '';
    oldPassInput.value = '';
    passwordInput.placeholder = "Nueva contraseña";
});


// ==========================================
// GESTIÓN DE BROKERS (CRUD)
// ==========================================

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function renderDashboard() {
    renderStats();
    renderBoard();
}

function renderStats() {
    const total = store.brokers.length;
    document.getElementById('total-brokers').innerText = total;

    const counts = {
        nuevo: 0,
        contactado: 0,
        procedimientos: 0,
        cerrado: 0,
        perdido: 0
    };

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

    // Limpiar columnas
    ['nuevo', 'contactado', 'procedimientos', 'cerrado', 'perdido'].forEach(status => {
        document.getElementById(`list-${status}`).innerHTML = '';
    });

    store.brokers.forEach(broker => {
        // Filtros
        if (filterStatus !== 'all' && broker.status !== filterStatus) return;

        const textMatch = broker.name.toLowerCase().includes(filterText) ||
            (broker.company && broker.company.toLowerCase().includes(filterText));

        if (!textMatch) return;

        // Crear Card
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

// Filtros eventos
document.getElementById('search-input').addEventListener('input', renderBoard);
document.getElementById('filter-status').addEventListener('change', renderBoard);

// Modales
const brokerModal = document.getElementById('broker-modal');
const deleteModal = document.getElementById('delete-modal');

document.getElementById('add-broker-btn').addEventListener('click', () => {
    document.getElementById('broker-form').reset();
    document.getElementById('broker-id').value = '';
    document.getElementById('modal-title').innerText = 'Nuevo Broker';
    brokerModal.classList.remove('hidden');
});

document.querySelectorAll('.close-modal, #cancel-broker-btn, #cancel-delete-btn').forEach(el => {
    el.addEventListener('click', () => {
        brokerModal.classList.add('hidden');
        deleteModal.classList.add('hidden');
    });
});

document.getElementById('broker-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('broker-id').value;
    const name = document.getElementById('broker-name').value;
    const company = document.getElementById('broker-company').value;
    const email = document.getElementById('broker-email').value;
    const whatsapp = document.getElementById('broker-whatsapp').value;
    const status = document.getElementById('broker-status').value;
    const notes = document.getElementById('broker-notes').value;

    if (!name) return;

    if (id) {
        // Editar
        const index = store.brokers.findIndex(c => c.id === id);
        if (index > -1) {
            store.brokers[index] = { ...store.brokers[index], name, company, email, whatsapp, status, notes };
            showToast('Broker actualizado', 'success');
        }
    } else {
        // Crear
        store.brokers.push({
            id: generateId(),
            name, company, email, whatsapp, status, notes,
            createdAt: new Date()
        });
        showToast('Broker creado', 'success');
    }

    saveData();
    renderDashboard();
    brokerModal.classList.add('hidden');
});

// Funciones globales para botones onclick inline
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

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (brokerToDeleteId) {
        store.brokers = store.brokers.filter(c => c.id !== brokerToDeleteId);
        saveData();
        renderDashboard();
        showToast('Broker eliminado', 'info');
    }
    deleteModal.classList.add('hidden');
});

// ==========================================
// DRAG AND DROP
// ==========================================

window.allowDrop = (ev) => {
    ev.preventDefault();
}

window.drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
}

window.drop = (ev) => {
    ev.preventDefault();
    const brokerId = ev.dataTransfer.getData("text");
    // Encontrar el elemento columna más cercano (por si se suelta sobre una tarjeta)
    const column = ev.target.closest('.column');

    if (column && brokerId) {
        const newStatus = column.dataset.status;
        const broker = store.brokers.find(c => c.id === brokerId);

        if (broker && broker.status !== newStatus) {
            broker.status = newStatus;
            saveData();
            renderDashboard();
            showToast(`Broker movido a ${newStatus}`, 'success');
        }
    }
}

// ==========================================
// EXPORT / IMPORT
// ==========================================

document.getElementById('export-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(store);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `crm_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();
});

document.getElementById('import-btn-trigger').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            // Validación simple
            if (data.brokers && data.config) {
                store.brokers = data.brokers;
                store.config = data.config;
                // Mantener sesión actual o forzar login dependiendo de lo deseado.
                // Aquí conservamos la sesión activa actual para no echar al usuario tras importar.
                store.session.active = true;
                saveData();
                renderDashboard();
                showToast('Datos importados correctamente', 'success');
            } else {
                // Backward compatibility try
                if (data.clients) {
                    store.brokers = data.clients;
                    store.config = data.config;
                    store.session.active = true;
                    saveData();
                    renderDashboard();
                    showToast('Datos de clientes importados como brokers', 'success');
                } else {
                    showToast('Archivo inválido', 'error');
                }
            }
        } catch (err) {
            showToast('Error al leer el archivo', 'error');
        }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

loadData();
initAuth();
