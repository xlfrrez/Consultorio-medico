/**
 * Módulo de Almacenamiento (Storage)
 * Proporciona métodos genéricos para guardar y recuperar datos de LocalStorage.
 */
const Storage = {
    // Obtener datos por clave
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    // Guardar datos por clave
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Generar un ID único simple
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
