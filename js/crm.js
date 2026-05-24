// crm.js
// Lógica CRM: CRUD de pacientes
import { storage } from './storage.js';
import { UI } from './ui.js';

export const CRM = (() => {
  // Validaciones básicas para el formulario de pacientes
  function validatePatient(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('Nombre es requerido.');
    if (data.age !== undefined && (isNaN(Number(data.age)) || Number(data.age) < 0)) {
      errors.push('Edad inválida.');
    }
    if (data.email && data.email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) errors.push('Correo no válido.');
    }
    return errors;
  }

  function createPatient(data) {
    const p = {
      id: Date.now().toString(),
      name: data.name?.trim(),
      age: data.age ? Number(data.age) : undefined,
      phone: data.phone?.trim(),
      email: data.email?.trim(),
      reason: data.reason?.trim()
    };
    storage.addPatient(p);
    return p;
  }

  function updatePatient(id, data) {
    const updated = {};
    if (data.name !== undefined) updated.name = data.name?.trim();
    if (data.age !== undefined) updated.age = Number(data.age);
    if (data.phone !== undefined) updated.phone = data.phone?.trim();
    if (data.email !== undefined) updated.email = data.email?.trim();
    if (data.reason !== undefined) updated.reason = data.reason?.trim();
    return storage.updatePatient(id, updated);
  }

  function deletePatient(id) {
    storage.deletePatient(id);
  }

  function getAllPatients() {
    return storage.getPatients();
  }

  // Métodos de utilidad para vistas
  function renderPatients(container, onEdit, onDelete, searchQuery = '') {
    const patients = getAllPatients();
    const filtered = searchQuery
      ? patients.filter(p => {
          const q = searchQuery.toLowerCase();
          return [p.name, p.phone, p.email].join(' ').toLowerCase().includes(q);
        })
      : patients;

    const headers = ['Nombre', 'Edad', 'Teléfono', 'Correo', 'Motivo', 'Acciones'];
    UI.renderTable(container, filtered, {
      headers,
      rowRenderer: (row) => {
        // Construir celdas
        const name = UI.td(row.name ?? '');
        const age = UI.td(row.age ?? '');
        const phone = UI.td(row.phone ?? '');
        const email = UI.td(row.email ?? '');
        const reason = UI.td(row.reason ?? '');

        // Acciones
        const actions = document.createElement('td');
        actions.className = 'action-btns';
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () => onEdit(row.id));
        const btnDel = document.createElement('button');
        btnDel.className = 'btn';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', () => {
          if (confirm('¿Seguro que desea eliminar este paciente?')) {
            deletePatient(row.id);
            renderPatients(container, onEdit, onDelete, searchQuery);
            UI.showToast('Paciente eliminado');
          }
        });
        actions.appendChild(btnEdit);
        actions.appendChild(btnDel);

        // Devuelve el array de celdas (incluye la de acciones)
        return [name, age, phone, email, reason, actions];
      }
    });
  }

  // Exposición pública
  return {
    createPatient,
    updatePatient,
    deletePatient,
    getAllPatients,
    renderPatients
  };
})();