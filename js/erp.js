// erp.js
// Lógica ERP: Citas, Servicios y Productos (CRUD)
import { storage } from './storage.js';
import { UI } from './ui.js';

export const ERP = (() => {
  // Citas
  function createAppointment(data) {
    const appt = {
      id: Date.now().toString(),
      name: data.name?.trim(),
      date: data.date,
      reason: data.reason?.trim(),
      description: data.description?.trim()
    };
    storage.addAppointment(appt);
    return appt;
  }
  function getAppointments() { return storage.getAppointments(); }
  function updateAppointment(id, data) {
    const updated = {};
    if (data.name !== undefined) updated.name = data.name;
    if (data.date !== undefined) updated.date = data.date;
    if (data.reason !== undefined) updated.reason = data.reason;
    if (data.description !== undefined) updated.description = data.description;
    return storage.updateAppointment(id, updated);
  }
  function deleteAppointment(id) { storage.deleteAppointment(id); }

  // Servicios
  function createService(data) {
    const s = {
      id: Date.now().toString(),
      name: data.name?.trim(),
      price: data.price !== undefined ? Number(data.price) : 0,
      date: data.date || '',
      description: data.description?.trim() || ''
    };
    storage.addService(s);
    return s;
  }
  function getServices() { return storage.getServices(); }
  function updateService(id, data) {
    const updated = {};
    if (data.name !== undefined) updated.name = data.name;
    if (data.price !== undefined) updated.price = Number(data.price);
    if (data.date !== undefined) updated.date = data.date;
    if (data.description !== undefined) updated.description = data.description;
    return storage.updateService(id, updated);
  }
  function deleteService(id) { storage.deleteService(id); }

  // Productos
  function createProduct(data) {
    const p = {
      id: Date.now().toString(),
      name: data.name?.trim(),
      price: data.price !== undefined ? Number(data.price) : 0,
      date: data.date || '',
      description: data.description?.trim() || ''
    };
    storage.addProduct(p);
    return p;
  }
  function getProducts() { return storage.getProducts(); }
  function updateProduct(id, data) {
    const updated = {};
    if (data.name !== undefined) updated.name = data.name;
    if (data.price !== undefined) updated.price = Number(data.price);
    if (data.date !== undefined) updated.date = data.date;
    if (data.description !== undefined) updated.description = data.description;
    return storage.updateProduct(id, updated);
  }
  function deleteProduct(id) { storage.deleteProduct(id); }

  // Render helpers simplificados
  function renderAppointments(container, onEdit, onDelete) {
    const items = getAppointments();
    const headers = ['Nombre', 'Fecha', 'Motivo', 'Descripción', 'Acciones'];
    UI.renderTable(container, items, {
      headers,
      rowRenderer: (row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.name ?? ''}</td>
          <td>${row.date ?? ''}</td>
          <td>${row.reason ?? ''}</td>
          <td>${row.description ?? ''}</td>
          <td class="action-btns"></td>
        `;
        const actionsTd = tr.querySelector('td:last-child');
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () => onEdit(row.id));

        const btnDel = document.createElement('button');
        btnDel.className = 'btn';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', () => {
          if (confirm('¿Seguro que desea eliminar esta cita?')) {
            deleteAppointment(row.id);
            renderAppointments(container, onEdit, onDelete);
            UI.showToast('Cita eliminada');
          }
        });

        actionsTd.appendChild(btnEdit);
        actionsTd.appendChild(btnDel);
        // Devolver el row ya con celdas completas
        return [
          tr.children[0],
          tr.children[1],
          tr.children[2],
          tr.children[3],
          actionsTd
        ];
      }
    });
  }

  function renderServices(container, onEdit, onDelete) {
    const items = getServices();
    const headers = ['Nombre', 'Precio', 'Fecha', 'Descripción', 'Acciones'];
    UI.renderTable(container, items, {
      headers,
      rowRenderer: (row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.name ?? ''}</td>
          <td>${row.price?.toFixed ? row.price.toFixed(2) : row.price ?? ''}</td>
          <td>${row.date ?? ''}</td>
          <td>${row.description ?? ''}</td>
          <td class="action-btns"></td>
        `;
        const actionsTd = tr.querySelector('td:last-child');
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () => onEdit(row.id));

        const btnDel = document.createElement('button');
        btnDel.className = 'btn';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', () => {
          if (confirm('¿Seguro que desea eliminar este servicio?')) {
            deleteService(row.id);
            renderServices(container, onEdit, onDelete);
            UI.showToast('Servicio eliminado');
          }
        });

        actionsTd.appendChild(btnEdit);
        actionsTd.appendChild(btnDel);
        return [document.createTextNode(row.name ?? ''), document.createTextNode(row.price ?? ''), document.createTextNode(row.date ?? ''), document.createTextNode(row.description ?? ''), actionsTd];
      }
    });
  }

  function renderProducts(container, onEdit, onDelete) {
    const items = getProducts();
    const headers = ['Nombre', 'Precio', 'Fecha', 'Descripción', 'Acciones'];
    UI.renderTable(container, items, {
      headers,
      rowRenderer: (row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.name ?? ''}</td>
          <td>${row.price?.toFixed ? row.price.toFixed(2) : row.price ?? ''}</td>
          <td>${row.date ?? ''}</td>
          <td>${row.description ?? ''}</td>
          <td class="action-btns"></td>
        `;
        const actionsTd = tr.querySelector('td:last-child');
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () => onEdit(row.id));

        const btnDel = document.createElement('button');
        btnDel.className = 'btn';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', () => {
          if (confirm('¿Seguro que desea eliminar este producto?')) {
            deleteProduct(row.id);
            renderProducts(container, onEdit, onDelete);
            UI.showToast('Producto eliminado');
          }
        });

        actionsTd.appendChild(btnEdit);
        actionsTd.appendChild(btnDel);
        return [
          document.createTextNode(row.name ?? ''),
          document.createTextNode(row.price ?? ''),
          document.createTextNode(row.date ?? ''),
          document.createTextNode(row.description ?? ''),
          actionsTd
        ];
      }
    });
  }

  // Exposición
  return {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
    renderAppointments,
    createService,
    getServices,
    updateService,
    deleteService,
    renderServices,
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    renderProducts
  };
})();