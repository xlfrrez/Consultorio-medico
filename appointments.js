/**
 * Módulo de Citas (ERP/Agenda)
 */
const Appointments = {
    STORAGE_KEY: 'medicare_appointments',
    appointments: [],

    init() {
        this.appointments = Storage.get(this.STORAGE_KEY);
        this.cacheDOM();
        this.bindEvents();
        this.updatePatientSelect();
        this.renderTable();
    },

    cacheDOM() {
        this.btnNew = document.getElementById('btn-new-appointment');
        this.btnCancel = document.getElementById('btn-cancel-appointment');
        this.form = document.getElementById('appointment-form');
        this.tbody = document.getElementById('appointments-tbody');
        this.formTitle = document.getElementById('appointment-form-title');
        this.patientSelect = document.getElementById('appointment-patient');
    },

    bindEvents() {
        this.btnNew.addEventListener('click', () => {
            if (Patients.getPatientsList().length === 0) {
                alert('Primero debe registrar al menos un paciente.');
                return;
            }
            this.formTitle.textContent = 'Programar Nueva Cita';
            UI.clearForm('appointment-form');
            UI.toggleForm('appointment-form-container', true);
            
            // Establecer fecha y hora actual por defecto
            const now = new Date();
            document.getElementById('appointment-date').value = now.toISOString().split('T')[0];
            document.getElementById('appointment-time').value = now.toTimeString().slice(0,5);
        });

        this.btnCancel.addEventListener('click', () => {
            UI.toggleForm('appointment-form-container', false);
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointment();
        });
    },

    updatePatientSelect() {
        if (!this.patientSelect) return;
        const patients = Patients.getPatientsList();
        this.patientSelect.innerHTML = '<option value="">Seleccione un paciente...</option>';
        patients.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.name;
            this.patientSelect.appendChild(option);
        });
    },

    saveAppointment() {
        const idInput = document.getElementById('appointment-id').value;
        const appointmentData = {
            patientId: document.getElementById('appointment-patient').value,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            status: document.getElementById('appointment-status').value,
            totalCost: parseFloat(document.getElementById('appointment-total-cost').value) || 0,
            paidAmount: parseFloat(document.getElementById('appointment-paid-amount').value) || 0,
            reason: document.getElementById('appointment-reason').value
        };

        if (idInput) {
            const index = this.appointments.findIndex(a => a.id === idInput);
            if (index !== -1) {
                this.appointments[index] = { ...this.appointments[index], ...appointmentData };
                alert('Cita actualizada correctamente.');
            }
        } else {
            appointmentData.id = Storage.generateId();
            this.appointments.push(appointmentData);
            alert('Cita programada correctamente.');
        }

        // Ordenar citas por fecha y hora (las más próximas primero)
        this.appointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        Storage.set(this.STORAGE_KEY, this.appointments);
        UI.toggleForm('appointment-form-container', false);
        UI.clearForm('appointment-form');
        this.renderTable();
        this.updatePatientSelect();

        // Actualizar la tabla de pacientes para reflejar el cambio
        if (typeof Patients !== 'undefined') {
            Patients.renderTable();
        }
    },

    editAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (!appointment) return;

        document.getElementById('appointment-id').value = appointment.id;
        document.getElementById('appointment-patient').value = appointment.patientId;
        document.getElementById('appointment-date').value = appointment.date;
        document.getElementById('appointment-time').value = appointment.time;
        document.getElementById('appointment-status').value = appointment.status;
        document.getElementById('appointment-total-cost').value = appointment.totalCost !== undefined ? appointment.totalCost : 650;
        document.getElementById('appointment-paid-amount').value = appointment.paidAmount !== undefined ? appointment.paidAmount : 0;
        document.getElementById('appointment-reason').value = appointment.reason;

        this.formTitle.textContent = 'Editar Cita';
        UI.toggleForm('appointment-form-container', true);
        window.scrollTo(0, 0);
    },

    deleteAppointment(id) {
        if (confirm('¿Está seguro de cancelar/eliminar esta cita?')) {
            this.appointments = this.appointments.filter(a => a.id !== id);
            Storage.set(this.STORAGE_KEY, this.appointments);
            this.renderTable();
            
            // Actualizar la tabla de pacientes para reflejar el cambio de saldo
            if (typeof Patients !== 'undefined') {
                Patients.renderTable();
            }
        }
    },

    toggleStatus(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (!appointment) return;
        
        if (appointment.status === 'Pendiente') {
            appointment.status = 'Completada';
        } else if (appointment.status === 'Completada') {
            appointment.status = 'Cancelada';
        } else {
            appointment.status = 'Pendiente';
        }

        Storage.set(this.STORAGE_KEY, this.appointments);
        this.renderTable();
    },

    renderTable() {
        // Re-consultar el elemento cada vez para evitar fallos de referencia
        const tbody = document.getElementById('appointments-tbody');
        if (!tbody) return;
        this.tbody = tbody;
        this.tbody.innerHTML = '';

        if (this.appointments.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay citas programadas</td></tr>';
            return;
        }

        this.appointments.forEach(appointment => {
            // Dar formato a la fecha
            const dateObj = new Date(`${appointment.date}T${appointment.time}`);
            const dateStr = dateObj.toLocaleDateString() + ' ' + appointment.time;
            
            const patientName = Patients.getPatientName(appointment.patientId);
            const statusClass = `status-${appointment.status.toLowerCase()}`;

            let paymentStatus = 'Pendiente';
            const total = appointment.totalCost || 0;
            const paid = appointment.paidAmount || 0;
            if (paid >= total && total > 0) {
                paymentStatus = 'Pagado';
            } else if (paid > 0 && paid < total) {
                paymentStatus = 'Abono';
            }

            let paymentBadgeClass = 'status-pendiente';
            if (paymentStatus === 'Pagado') {
                paymentBadgeClass = 'status-completada';
            } else if (paymentStatus === 'Abono') {
                paymentBadgeClass = 'status-completada';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${patientName}</strong></td>
                <td>${appointment.reason}</td>
                <td><span class="status-badge ${statusClass}" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" onclick="Appointments.toggleStatus('${appointment.id}')" title="Clic para cambiar el estado">${appointment.status}</span></td>
                <td>$${total}</td>
                <td>$${paid}</td>
                <td><span class="status-badge ${paymentBadgeClass}">${paymentStatus}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="Appointments.editAppointment('${appointment.id}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="Appointments.deleteAppointment('${appointment.id}')">🗑️ Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(tr);
        });
    }
};
