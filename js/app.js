// app.js
// Orquestación principal: manejo de SPA, eventos y conectores entre UI y Lógica
import { storage } from './storage.js';
import { CRM } from './crm.js';
import { ERP } from './erp.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Navegación SPA: mostrar / ocultar secciones
  const sections = {
    dashboard: document.getElementById('dashboard'),
    crm: document.getElementById('crm'),
    erp: document.getElementById('erp')
  };
  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  function showSection(name) {
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    sections[name].classList.remove('hidden');
    // Activa el botón correspondiente
    navButtons.forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.nav-btn[data-section="${name}"]`);
    if (btn) btn.classList.add('active');
    // Actualizar estadísticas si se muestra Dashboard
    if (name === 'dashboard') updateStats();
  }

  // Botones de navegación
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.getAttribute('data-section');
      showSection(sec);
    });
  });

  // Inicializar: mostrar Dashboard por defecto
  showSection('dashboard');

  // Funciones utilitarias de UI/Renderizado
  function updateStats() {
    const patients = storage.getPatients().length;
    const appointments = storage.getAppointments().length;
    const products = storage.getProducts().length;
    document.getElementById('stat-patients').textContent = String(patients);
    document.getElementById('stat-appointments').textContent = String(appointments);
    document.getElementById('stat-products').textContent = String(products);
  }

  // --- CRM: Pacientes ---
  const crmForm = document.getElementById('crm-form');
  const crmName = document.getElementById('crm-name');
  const crmAge = document.getElementById('crm-age');
  const crmPhone = document.getElementById('crm-phone');
  const crmEmail = document.getElementById('crm-email');
  const crmReason = document.getElementById('crm-context');
  const crmSubmit = document.getElementById('crm-submit');
  const crmClear = document.getElementById('crm-clear');
  const crmTableContainer = document.getElementById('crm-table-container');
  const crmSearch = document.getElementById('crm-search');

  let crmEditId = null;

  function renderCRM() {
    CRM.renderPatients(crmTableContainer, (id) => {
      // Edit
      const p = storage.getPatients().find(x => x.id === id);
      if (p) {
        crmEditId = id;
        crmName.value = p.name;
        crmAge.value = p.age ?? '';
        crmPhone.value = p.phone ?? '';
        crmEmail.value = p.email ?? '';
        crmReason.value = p.reason ?? '';
        crmSubmit.textContent = 'Actualizar';
      }
    }, (id) => {
      // Delete desde la UI
      if (confirm('¿Seguro que desea eliminar este paciente?')) {
        CRM.deletePatient(id);
        renderCRM();
        updateStats();
        UI.showToast('Paciente eliminado');
      }
    }, crmSearch.value);
  }

  crmForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = crmName.value;
    const age = crmAge.value;
    const phone = crmPhone.value;
    const email = crmEmail.value;
    const reason = crmReason.value;

    const data = { name, age, phone, email, reason };

    // Validar
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Nombre es obligatorio');
    if (age && (isNaN(Number(age)) || Number(age) < 0)) errors.push('Edad inválida');

    if (errors.length) {
      UI.showToast(errors.join(' | '), 3500);
      return;
    }

    if (crmEditId) {
      // Actualizar
      const updated = CRM.updatePatient(crmEditId, data);
      if (updated) {
        UI.showToast('Paciente actualizado correctamente');
      } else {
        UI.showToast('Error al actualizar', 3000);
      }
      crmEditId = null;
      crmSubmit.textContent = 'Guardar';
    } else {
      // Crear
      const created = CRM.createPatient(data);
      if (created) {
        UI.showToast('Paciente registrado');
      }
    }

    crmForm.reset();
    renderCRM();
    updateStats();
  });

  crmClear.addEventListener('click', () => {
    crmForm.reset();
    crmEditId = null;
    crmSubmit.textContent = 'Guardar';
  });

  crmSearch.addEventListener('input', () => {
    renderCRM();
  });

  // Inicializar CRM
  renderCRM();

  // --- ERP: Citas, Servicios y Productos ---

  // Citas
  const apptName = document.getElementById('appointment-name');
  const apptDate = document.getElementById('appointment-date');
  const apptReason = document.getElementById('appointment-reason');
  const apptDesc = document.getElementById('appointment-desc');
  const apptForm = document.getElementById('appointments-form');
  const apptTable = document.getElementById('appointments-table');
  function renderCitas() {
    ERP.renderAppointments(apptTable, (id) => {
      // Edit cita
      const all = storage.getAppointments();
      const target = all.find(a => a.id === id);
      if (target) {
        apptName.value = target.name;
        apptDate.value = target.date;
        apptReason.value = target.reason;
        apptDesc.value = target.description;
        apptForm.dataset.editId = id;
      }
    }, (id) => {
      // Eliminar
      if (confirm('¿Seguro que desea eliminar esta cita?')) {
        ERP.deleteAppointment(id);
        renderCitas();
        updateStats();
        UI.showToast('Cita eliminada');
      }
    });
  }

  apptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = apptName.value;
    const date = apptDate.value;
    const reason = apptReason.value;
    const description = apptDesc.value;

    if (!name || !date) {
      UI.showToast('Nombre y fecha son obligatorios para la cita');
      return;
    }

    const editId = apptForm.dataset.editId;
    if (editId) {
      ERP.updateAppointment(editId, { name, date, reason, description });
      apptForm.removeAttribute('data-edit-id');
      apptForm.dataset.editId = '';
      UI.showToast('Cita actualizada');
    } else {
      ERP.createAppointment({ name, date, reason, description });
      UI.showToast('Cita creada');
    }

    apptForm.reset();
    renderCitas();
    updateStats();
  });

  // Servicios
  const serviceName = document.getElementById('service-name');
  const servicePrice = document.getElementById('service-price');
  const serviceDate = document.getElementById('service-date');
  const serviceDesc = document.getElementById('service-desc');
  const servicesForm = document.getElementById('services-form');
  const servicesTable = document.getElementById('services-table');
  function renderServicios() {
    ERP.renderServices(servicesTable, (id) => {
      const s = storage.getServices().find(x => x.id === id);
      if (s) {
        serviceName.value = s.name;
        servicePrice.value = s.price;
        serviceDate.value = s.date;
        serviceDesc.value = s.description;
        servicesForm.dataset.editId = id;
      }
    }, (id) => {
      if (confirm('¿Seguro que desea eliminar este servicio?')) {
        ERP.deleteService(id);
        renderServicios();
        updateStats();
        UI.showToast('Servicio eliminado');
      }
    });
  }

  servicesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = serviceName.value;
    const price = servicePrice.value;
    const date = serviceDate.value;
    const description = serviceDesc.value;

    if (!name) {
      UI.showToast('El nombre del servicio es obligatorio');
      return;
    }

    const editId = servicesForm.dataset.editId;
    if (editId) {
      ERP.updateService(editId, { name, price, date, description });
      servicesForm.removeAttribute('data-edit-id');
      UI.showToast('Servicio actualizado');
    } else {
      ERP.createService({ name, price, date, description });
      UI.showToast('Servicio registrado');
    }

    servicesForm.reset();
    renderServicios();
    updateStats();
  });

  // Productos
  const productName = document.getElementById('product-name');
  const productPrice = document.getElementById('product-price');
  const productDate = document.getElementById('product-date');
  const productDesc = document.getElementById('product-desc');
  const productsForm = document.getElementById('products-form');
  const productsTable = document.getElementById('products-table');
  function renderProductos() {
    ERP.renderProducts(productsTable, (id) => {
      const p = storage.getProducts().find(x => x.id === id);
      if (p) {
        productName.value = p.name;
        productPrice.value = p.price;
        productDate.value = p.date;
        productDesc.value = p.description;
        productsForm.dataset.editId = id;
      }
    }, (id) => {
      if (confirm('¿Seguro que desea eliminar este producto?')) {
        ERP.deleteProduct(id);
        renderProductos();
        updateStats();
        UI.showToast('Producto eliminado');
      }
    });
  }

  productsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = productName.value;
    const price = productPrice.value;
    const date = productDate.value;
    const description = productDesc.value;

    if (!name) {
      UI.showToast('El nombre del producto es obligatorio');
      return;
    }

    const editId = productsForm.dataset.editId;
    if (editId) {
      ERP.updateProduct(editId, { name, price, date, description });
      productsForm.removeAttribute('data-edit-id');
      UI.showToast('Producto actualizado');
    } else {
      ERP.createProduct({ name, price, date, description });
      UI.showToast('Producto registrado');
    }

    productsForm.reset();
    renderProductos();
    updateStats();
  });

  // Inicialización de ERP
  renderCitas();
  renderServicios();
  renderProductos();

  // Actualizar stats en dashboard cuando se cargue
  function updateStats() {
    document.getElementById('stat-patients').textContent = String(storage.getPatients().length);
    document.getElementById('stat-appointments').textContent = String(storage.getAppointments().length);
    document.getElementById('stat-products').textContent = String(storage.getProducts().length);
  }

  // Carga inicial de datos de ejemplo si está vacío
  function seedIfEmpty() {
    if (storage.getPatients().length === 0) {
      storage.addPatient({ id: 'p1', name: 'María López', age: 34, phone: '+34 600 000 001', email: 'maria@example.com', reason: 'Chequeo general' });
    }
    if (storage.getAppointments().length === 0) {
      storage.addAppointment({ id: 'a1', name: 'María López', date: new Date().toISOString().slice(0,10), reason: 'Chequeo anual', description: '' });
    }
    if (storage.getServices().length === 0) {
      storage.addService({ id: 's1', name: 'Ecografía', price: 120.0, date: '', description: 'Ecografía abdominal' });
    }
    if (storage.getProducts().length === 0) {
      storage.addProduct({ id: 'pr1', name: 'Ibuprofeno 400mg', price: 3.5, date: '', description: 'Caja con 20 tabletas' });
    }
  }
  seedIfEmpty();

  // Mostrar Dashboard por defecto al cargar
  // (El usuario puede cambiar a CRM/ERP desde la navegación)
});