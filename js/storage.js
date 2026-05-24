// storage.js
// Módulo de almacenamiento en LocalStorage (CRUD base)
export const storage = (() => {
  const KEYS = {
    patients: 'clinic_crm_patients',
    appointments: 'clinic_erp_appointments',
    services: 'clinic_erp_services',
    products: 'clinic_erp_products'
  };

  const _get = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const _set = (key, arr) => {
    localStorage.setItem(key, JSON.stringify(arr));
  };

  // Pacientes (CRM)
  const getPatients = () => _get(KEYS.patients);
  const setPatients = (arr) => _set(KEYS.patients, arr);
  const addPatient = (p) => {
    const arr = getPatients();
    arr.push(p);
    setPatients(arr);
    return p;
  };
  const updatePatient = (id, updated) => {
    const arr = getPatients();
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...updated };
      setPatients(arr);
      return arr[idx];
    }
    return null;
  };
  const deletePatient = (id) => {
    const arr = getPatients().filter(p => p.id !== id);
    setPatients(arr);
  };

  // Citas (ERP)
  const getAppointments = () => _get(KEYS.appointments);
  const setAppointments = (arr) => _set(KEYS.appointments, arr);
  const addAppointment = (a) => {
    const arr = getAppointments();
    arr.push(a);
    setAppointments(arr);
    return a;
  };
  const updateAppointment = (id, updated) => {
    const arr = getAppointments();
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...updated };
      setAppointments(arr);
      return arr[idx];
    }
    return null;
  };
  const deleteAppointment = (id) => {
    const arr = getAppointments().filter(x => x.id !== id);
    setAppointments(arr);
  };

  // Servicios
  const getServices = () => _get(KEYS.services);
  const setServices = (arr) => _set(KEYS.services, arr);
  const addService = (s) => {
    const arr = getServices();
    arr.push(s);
    setServices(arr);
    return s;
  };
  const updateService = (id, updated) => {
    const arr = getServices();
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...updated };
      setServices(arr);
      return arr[idx];
    }
    return null;
  };
  const deleteService = (id) => {
    const arr = getServices().filter(x => x.id !== id);
    setServices(arr);
  };

  // Productos
  const getProducts = () => _get(KEYS.products);
  const setProducts = (arr) => _set(KEYS.products, arr);
  const addProduct = (p) => {
    const arr = getProducts();
    arr.push(p);
    setProducts(arr);
    return p;
  };
  const updateProduct = (id, updated) => {
    const arr = getProducts();
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...updated };
      setProducts(arr);
      return arr[idx];
    }
    return null;
  };
  const deleteProduct = (id) => {
    const arr = getProducts().filter(x => x.id !== id);
    setProducts(arr);
  };

  // Exposición pública
  return {
    // Pacientes
    getPatients, setPatients, addPatient, updatePatient, deletePatient,
    // Citas
    getAppointments, setAppointments, addAppointment, updateAppointment, deleteAppointment,
    // Servicios
    getServices, setServices, addService, updateService, deleteService,
    // Productos
    getProducts, setProducts, addProduct, updateProduct, deleteProduct
  };
})();