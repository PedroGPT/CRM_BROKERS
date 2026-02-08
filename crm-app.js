
// ERROR HANDLER (DEBUGGING)
window.onerror = function (msg, url, line) {
    alert("Error JS: " + msg + "\nLínea: " + line);
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================

var SUPABASE_URL = 'https://xhcchfehqafmovietgom.supabase.co';
var SUPABASE_KEY = 'sb_publishable_fdnykftr9iBH2pEZFeuH6g_YS5qzYAU';
var supabase = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ==========================================
// ESTADO LOCAL (Cache)
// ==========================================

var store = {
    brokers: [],
    vendors: [],
    procedures: [],
    session: null,
    lang: 'es' // 'es' or 'en'
};

const translations = {
    es: {
        dashboard: "📊 Tablero",
        vendors: "🏢 Sellers",
        procedures: "📄 Procedimientos",
        new_broker: "+ Nuevo Broker",
        new_vendor: "+ Nuevo Seller",
        new_procedure: "+ Nuevo Procedimiento",
        search_placeholder: "🔍 Buscar...",
        total_brokers: "Total Brokers",
        export: "💾 Exportar",
        import: "📂 Importar",
        account: "👤 Cuenta",
        login_btn: "🔑 Acceso Admin",
        logout: "Cerrar Sesión",
        welcome_title: "Bienvenido al CRM",
        welcome_msg: "Por favor, introduce tu clave de administrador.",

        // Cards & Lists
        mandate: "Mandato",
        category: "Categoría",
        contact: "Contacto",
        web: "Web",
        empty_list: "No hay elementos para mostrar.",

        // Kanban Headers
        status_nuevo: "Nuevo",
        status_contactado: "Contactado",
        status_procedimientos: "Procedimientos",
        status_cerrado: "Cerrado",
        status_perdido: "Perdido",

        // Modals & Forms
        modal_new_broker: "Nuevo Broker",
        modal_edit_broker: "Editar Broker",
        modal_new_vendor: "Nuevo Seller",
        modal_edit_vendor: "Editar Seller",
        modal_new_procedure: "Nuevo Procedimiento",

        lbl_name: "Nombre *",
        lbl_company: "Empresa",
        lbl_email: "Email",
        lbl_whatsapp: "WhatsApp",
        lbl_status: "Estado *",
        lbl_notes: "Notas",
        lbl_category: "Categoría",
        lbl_contact: "Contacto / Email",
        lbl_web: "Web / Portal",
        lbl_mandate: "Mandato de Ventas",
        lbl_title: "Título *",
        lbl_vendor: "Vendedor *",
        lbl_content: "Contenido / Pasos",

        btn_cancel: "Cancelar",
        btn_save: "Guardar",
        btn_delete: "Eliminar",

        // Toasts
        msg_vendor_updated: "Seller actualizado",
        msg_vendor_created: "Seller creado",
        msg_error: "Error en la operación"
    },
    en: {
        dashboard: "📊 Dashboard",
        vendors: "🏢 Sellers",
        procedures: "📄 Procedures",
        new_broker: "+ New Broker",
        new_vendor: "+ New Seller",
        new_procedure: "+ New Procedure",
        search_placeholder: "🔍 Search...",
        total_brokers: "Total Brokers",
        export: "💾 Export",
        import: "📂 Import",
        account: "👤 Account",
        login_btn: "🔑 Admin Login",
        logout: "Logout",
        welcome_title: "Welcome to CRM",
        welcome_msg: "Please enter your admin password.",

        // Cards & Lists
        mandate: "Mandate",
        category: "Category",
        contact: "Contact",
        web: "Web",
        empty_list: "No items to display.",

        // Kanban Headers
        status_nuevo: "New",
        status_contactado: "Contacted",
        status_procedimientos: "Procedures",
        status_cerrado: "Closed",
        status_perdido: "Lost",

        // Modals & Forms
        modal_new_broker: "New Broker",
        modal_edit_broker: "Edit Broker",
        modal_new_vendor: "New Seller",
        modal_edit_vendor: "Edit Seller",
        modal_new_procedure: "New Procedure",

        lbl_name: "Name *",
        lbl_company: "Company",
        lbl_email: "Email",
        lbl_whatsapp: "WhatsApp",
        lbl_status: "Status *",
        lbl_notes: "Notes",
        lbl_category: "Category",
        lbl_contact: "Contact / Email",
        lbl_web: "Web / Portal",
        lbl_mandate: "Sales Mandate",
        lbl_title: "Title *",
        lbl_vendor: "Seller *",
        lbl_content: "Content / Steps",

        btn_cancel: "Cancel",
        btn_save: "Save",
        btn_delete: "Delete",

        // Toasts
        msg_vendor_updated: "Seller updated",
        msg_vendor_created: "Seller created",
        msg_error: "Operation failed"
    },
    zh: {
        dashboard: "📊 看板",
        vendors: "🏢 卖家",
        procedures: "📄 程序",
        new_broker: "+ 新经纪人",
        new_vendor: "+ 新卖家",
        new_procedure: "+ 新程序",
        search_placeholder: "🔍 搜索...",
        total_brokers: "经纪人总数",
        export: "💾 导出",
        import: "📂 导入",
        account: "👤 帐户",
        login_btn: "🔑 管理员登录",
        logout: "登出",
        welcome_title: "欢迎来到 CRM",
        welcome_msg: "请输入您的管理员密码。",

        // Cards & Lists
        mandate: "授权书",
        category: "类别",
        contact: "联系",
        web: "网络",
        empty_list: "没有可显示的项目。",

        // Kanban Headers
        status_nuevo: "新",
        status_contactado: "已联系",
        status_procedimientos: "程序",
        status_cerrado: "已关闭",
        status_perdido: "丢失",

        // Modals & Forms
        modal_new_broker: "新经纪人",
        modal_edit_broker: "编辑经纪人",
        modal_new_vendor: "新卖家",
        modal_edit_vendor: "编辑卖家",
        modal_new_procedure: "新程序",

        lbl_name: "姓名 *",
        lbl_company: "公司",
        lbl_email: "电子邮件",
        lbl_whatsapp: "WhatsApp",
        lbl_status: "状态 *",
        lbl_notes: "笔记",
        lbl_category: "类别",
        lbl_contact: "联系 / 电子邮件",
        lbl_web: "网络 / 门户",
        lbl_mandate: "销售授权书",
        lbl_title: "标题 *",
        lbl_vendor: "卖家 *",
        lbl_content: "内容 / 步骤",

        btn_cancel: "取消",
        btn_save: "保存",
        btn_delete: "删除",

        // Toasts
        msg_vendor_updated: "卖家已更新",
        msg_vendor_created: "卖家已创建",
        msg_error: "操作失败"
    }
};

function t(key) {
    return translations[store.lang][key] || key;
}

function updateTranslations() {
    // 1. Static Text via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[store.lang][key]) {
            // Preserve icons if they exist in HTML and not in translation? 
            // For now, simpler to just replace text.
            // If the element has children (like buttons with icons), we might need care.
            // But our keys mostly cover full text.
            el.innerText = t(key);
        }
    });

    // 2. Placeholders
    document.getElementById('search-input').placeholder = t('search_placeholder');
    document.getElementById('search-vendor').placeholder = t('search_placeholder');
    document.getElementById('search-procedure').placeholder = t('search_placeholder');

    // 3. Sync Selector
    const selector = document.getElementById('lang-selector');
    if (selector) selector.value = store.lang;
}

function setLanguage(lang) {
    store.lang = lang;
    updateTranslations();
    localStorage.setItem('crm_lang', lang);
    // Re-render lists to translate dynamic content
    renderVendors();
    renderProcedures();
    renderDashboard();
}

// ==========================================
// INIT APP
// ==========================================

function initApp() {
    console.log("Iniciando CRM...");

    // NAVEGACIÓN
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const viewId = `view-${btn.dataset.view}`;
            document.querySelectorAll('.view-container').forEach(v => v.classList.add('hidden'));
            document.getElementById(viewId).classList.remove('hidden');
            document.getElementById(viewId).classList.add('active');
            if (btn.dataset.view === 'vendors') renderVendors();
            if (btn.dataset.view === 'procedures') renderProcedures();
        });
    });

    // LOAD LANG
    const savedLang = localStorage.getItem('crm_lang') || 'es';
    setLanguage(savedLang);

    // START
    loadData();
}

async function loadData() {
    if (!supabase) {
        console.warn("Supabase not initialized");
        return;
    }

    try {
        const { data: vendors } = await supabase.from('vendors').select('*');
        if (vendors) store.vendors = vendors;

        const { data: procedures } = await supabase.from('procedures').select('*');
        if (procedures) store.procedures = procedures;

        const { data: brokers } = await supabase.from('brokers').select('*');
        if (brokers) store.brokers = brokers;

        // Check Local Session
        const localSession = localStorage.getItem('crm_session');
        if (localSession === 'active') {
            store.session = { active: true, role: 'admin' };
            setupAdminView();
        } else {
            // Broker/Guest Mode
            store.session = { active: true, role: 'broker' };
            document.querySelectorAll('.nav-item').forEach(el => el.style.display = 'inline-block');

            // Show "Login" button for Brokers to become Admins
            if (!document.getElementById('header-login-btn')) {
                const loginBtn = document.createElement('button');
                loginBtn.id = 'header-login-btn';
                loginBtn.className = 'btn btn-outline';
                loginBtn.innerText = t('login_btn');
                loginBtn.onclick = () => {
                    document.getElementById('app-section').classList.add('hidden');
                    document.getElementById('auth-section').classList.remove('hidden');
                };
                document.querySelector('.header-actions').prepend(loginBtn);
            }
        }

        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
        renderDashboard();

    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function setupAdminView() {
    // Show Tabs
    document.querySelectorAll('.nav-item').forEach(el => el.style.display = 'inline-block');
    // Show Add Buttons (Admin Only)
    document.getElementById('add-vendor-btn').classList.remove('hidden');
    document.getElementById('add-procedure-btn').classList.remove('hidden');

    // Hide Login Button if exists
    const loginBtn = document.getElementById('header-login-btn');
    if (loginBtn) loginBtn.remove();
}

// ==========================================
// AUTH LOGIC (SIMPLE)
// ==========================================

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password-input').value;

    if (password === 'admin123') {
        store.session = { active: true, role: 'admin' };
        localStorage.setItem('crm_session', 'active');
        setupAdminView();

        // REFRESH VIEWS TO SHOW ADMIN BUTTONS
        renderVendors();
        renderProcedures();
        renderDashboard();

        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
    } else {
        alert('Contraseña incorrecta (Prueba: admin123)');
    }
});

// Dropdown User Menu
document.getElementById('user-menu-btn').addEventListener('click', () => {
    document.getElementById('user-menu').classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.getElementById('user-menu').classList.add('hidden');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    store.session = null;
    localStorage.removeItem('crm_session');
    location.reload(); // Simple reload to clear state
});

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
    const isAdmin = store.session && store.session.role === 'admin';

    store.vendors.forEach(v => {
        if (!v.name.toLowerCase().includes(filter)) return;

        const card = document.createElement('div');
        card.className = 'vendor-card';
        card.innerHTML = `
            <div class="vendor-header">
                <div>
                    <span class="vendor-title">${v.name}</span>
                    ${v.sales_mandate ? `<div class="vendor-mandate">📜 ${v.sales_mandate}</div>` : ''}
                </div>
                ${v.category ? `<span class="vendor-category">${v.category}</span>` : ''}
            </div>
            <div class="card-details">
                ${v.contact_info ? '✉️ ' + v.contact_info + '<br>' : ''}
                ${v.website ? `🌐 <a href="${v.website}" target="_blank">${t('web')}</a>` : ''}
            </div>
            ${isAdmin ? `<div class="card-actions" style="margin-top:0.5rem; justify-content:flex-end;">
                <button class="icon-btn edit-btn" onclick="editVendor('${v.id}')">✏️</button>
            </div>` : ''}
        `;
        container.appendChild(card);
    });

    if (container.children.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>${t('empty_list')}</p></div>`;
    }
}

document.getElementById('add-vendor-btn').addEventListener('click', () => {
    document.getElementById('vendor-form').reset();
    document.getElementById('vendor-id').value = '';
    document.getElementById('vendor-modal-title').innerText = t('modal_new_vendor');
    document.getElementById('vendor-modal').classList.remove('hidden');
});

window.editVendor = (id) => {
    console.log("Editando vendor ID:", id); // DEBUG
    const v = store.vendors.find(item => item.id == id); // == for loose string/number comparison
    if (!v) {
        console.error("Vendor not found for ID:", id);
        return;
    }
    document.getElementById('vendor-id').value = v.id;
    document.getElementById('vendor-name').value = v.name;
    document.getElementById('vendor-category').value = v.category || '';
    document.getElementById('vendor-contact').value = v.contact_info || '';
    document.getElementById('vendor-website').value = v.website || '';
    document.getElementById('vendor-mandate').value = v.sales_mandate || '';

    document.getElementById('vendor-modal-title').innerText = t('modal_edit_vendor');
    document.getElementById('vendor-modal').classList.remove('hidden');
};

document.getElementById('vendor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Intentando guardar vendedor..."); // Debug

    const id = document.getElementById('vendor-id').value;
    const name = document.getElementById('vendor-name').value;
    const category = document.getElementById('vendor-category').value;
    const contact_info = document.getElementById('vendor-contact').value;
    const website = document.getElementById('vendor-website').value;
    const sales_mandate = document.getElementById('vendor-mandate').value;

    const dataObj = { name, category, contact_info, website, sales_mandate };
    console.log("Payload:", dataObj);

    try {
        if (id) {
            // UPDATE
            const { error } = await supabase.from('vendors').update(dataObj).eq('id', id);
            if (error) {
                console.error("Supabase Error (Update):", error);
                alert("Error al actualizar: " + error.message);
                return;
            }

            const index = store.vendors.findIndex(v => v.id == id);
            if (index !== -1) {
                store.vendors[index] = { ...store.vendors[index], ...dataObj };
            }
            showToast(t('msg_vendor_updated'), 'success');

        } else {
            // CREATE
            const { data, error } = await supabase.from('vendors').insert([dataObj]).select();
            if (error) {
                console.error("Supabase Error (Create):", error);
                alert("Error al crear: " + error.message);
                return;
            }

            if (data && data.length > 0) {
                store.vendors.push(data[0]);
                showToast(t('msg_vendor_created'), 'success');
            }
        }

        renderVendors();
        document.getElementById('vendor-modal').classList.add('hidden');

    } catch (err) {
        console.error("Catch Error:", err);
        alert("Error inesperado: " + err.message);
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
    const isAdmin = store.session && store.session.role === 'admin';

    store.procedures.forEach(p => {
        if (!p.title.toLowerCase().includes(filter)) return;
        // RELAXED CHECK: != instead of !== to handle string/number mismatch
        if (filterVendor !== 'all' && p.vendor_id != filterVendor) return;

        // RELAXED CHECK: == instead of ===
        const vendor = store.vendors.find(v => v.id == p.vendor_id) || { name: 'Desconocido', sales_mandate: '' };

        const card = document.createElement('div');
        card.className = 'procedure-card';
        card.innerHTML = `
            <div class="proc-meta">
                🏢 ${vendor.name} 
                ${vendor.sales_mandate ? `<span style="opacity:0.7; font-size:0.9em; margin-left:5px;">(${vendor.sales_mandate})</span>` : ''}
            </div>
            <div class="card-title">${p.title}</div>
            <div class="card-details">${p.content ? p.content.substring(0, 100) + '...' : ''}</div>
        `;
        container.appendChild(card);
    });

    if (container.children.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>${t('empty_list')}</p></div>`;
    }

    // Populate Filters (only once)
    const select = document.getElementById('filter-procedure-vendor');
    if (select.children.length === 1) {
        store.vendors.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.innerText = v.name;
            select.appendChild(opt);
        });

        // Modal Select
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

    // SAFE GUARD: Check if filter exists
    const filterEl = document.getElementById('filter-status');
    const filterStatus = filterEl ? filterEl.value : 'all';

    ['nuevo', 'contactado', 'procedimientos', 'cerrado', 'perdido'].forEach(status => {
        document.getElementById(`list-${status}`).innerHTML = '';
    });

    store.brokers.forEach(broker => {
        const status = (broker.status || 'nuevo').toLowerCase(); // Forced lowercase match

        if (filterStatus !== 'all' && status !== filterStatus) return;
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

        const col = document.getElementById(`list-${status}`);
        if (col) col.appendChild(card);
    });
}

// Filtros
document.getElementById('search-input').addEventListener('input', renderBoard);

// SAFE LISTENER
const filterStatusEl = document.getElementById('filter-status');
if (filterStatusEl) {
    filterStatusEl.addEventListener('change', renderBoard);
}

// Modales Brokers
var brokerModal = document.getElementById('broker-modal');
var deleteModal = document.getElementById('delete-modal');

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

var brokerToDeleteId = null;
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
                broker.status = oldStatus;
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
