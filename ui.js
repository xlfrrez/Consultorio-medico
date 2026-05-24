/**
 * Módulo de Interfaz de Usuario (UI)
 * Maneja la navegación y funciones de utilidad de la interfaz.
 */
const UI = {
    init() {
        this.setupNavigation();
    },

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');
        let isUnlocked = false; // Estado inicial bloqueado

        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.getAttribute('data-target');

                // Si no está desbloqueado y quiere ir a otra sección, lo bloqueamos
                if (!isUnlocked && targetId !== 'welcome-section') {
                    alert('Para comenzar a usar el sistema, por favor haz clic en "Bienvenido a agendar tu cita médica" en la pantalla de inicio.');
                    return;
                }

                // Remover clase active de todos los botones
                navBtns.forEach(b => b.classList.remove('active'));
                // Ocultar todas las secciones
                sections.forEach(s => s.classList.remove('active'));

                // Activar el botón clickeado
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('active');

                // Mostrar la sección correspondiente
                document.getElementById(targetId).classList.add('active');
            });
        });

        // Función global para desbloquear y redirigir
        window.unlockApp = () => {
            isUnlocked = true;
            document.querySelector('[data-target="appointments-section"]').click();
        };
    },

    // Muestra u oculta un formulario
    // show = true  → mostrar
    // show = false → ocultar
    // show = undefined → alternar
    toggleForm(containerId, show) {
        const container = document.getElementById(containerId);
        if (show === true) {
            container.classList.remove('hidden');
        } else if (show === false) {
            container.classList.add('hidden');
        } else {
            container.classList.toggle('hidden');
        }
    },

    // Limpia los datos de un formulario
    clearForm(formId) {
        document.getElementById(formId).reset();
        // Limpiar inputs ocultos (IDs)
        const hiddenInputs = document.getElementById(formId).querySelectorAll('input[type="hidden"]');
        hiddenInputs.forEach(input => input.value = '');
    }
};
