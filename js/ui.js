// ui.js
// Módulo de utilidades UI (renderizado, toasts, helpers)
export const UI = (() => {
  // Toast/Notificación
  const toastEl = document.getElementById('toast');
  function showToast(message, duration = 2500) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    // Ocultar tras el tiempo
    setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  // Renderizar tablas de CRM/ERP
  function renderTable(container, rows, { headers, rowRenderer }) {
    const table = document.createElement('table');
    table.className = 'table';
    // Encabezados
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);
    // Cuerpo
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      const tds = rowRenderer ? rowRenderer(row) : [];
      if (Array.isArray(tds)) {
        tds.forEach(td => tr.appendChild(td));
      } else if (tds instanceof Node) {
        tr.appendChild(tds);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
  }

  // Helpers para crear celdas y botones de acción
  function td(text) {
    const d = document.createElement('td');
    d.textContent = text ?? '';
    return d;
  }
  function actionButtons(editId, delId, onEdit, onDelete) {
    const tdEl = document.createElement('td');
    tdEl.className = 'action-btns';
    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.className = 'btn';
    btnEdit.addEventListener('click', () => onEdit(editId));

    const btnDel = document.createElement('button');
    btnDel.textContent = 'Eliminar';
    btnDel.className = 'btn';
    btnDel.addEventListener('click', () => onDelete(delId));

    tdEl.appendChild(btnEdit);
    tdEl.appendChild(btnDel);
    return tdEl;
  }

  // Exposición
  return {
    showToast,
    renderTable,
    td,
    actionButtons
  };
})();