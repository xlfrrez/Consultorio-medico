/**
 * Aplicación Principal
 * Inicializa todos los módulos cuando el DOM está listo.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la UI (Navegación)
    UI.init();

    // 2. Inicializar los Módulos
    Patients.init();
    Appointments.init();
    
    console.log("Sistema Médico Inicializado Correctamente.");
});
