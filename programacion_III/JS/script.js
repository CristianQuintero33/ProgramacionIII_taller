
let clientes = [];
let modoEdicion = false;

const formulario = document.getElementById('clienteForm');
const tablaClientes = document.getElementById('tablaClientes');
const emptyState = document.getElementById('emptyState');
const msgContainer = document.getElementById('ux-messages');
const btnCancel = document.getElementById('btnCancel');
const formTitle = document.getElementById('formTitle');
const totalClientesBadge = document.getElementById('totalClientes');


formulario.addEventListener('submit', procesarFormulario);
btnCancel.addEventListener('click', resetearFormulario);

// Nivel 4 & 6: Funciones y Lógica Principal
function procesarFormulario(e) {
    e.preventDefault(); // Prevenir recarga de página

    // Captura de valores
    const idField = document.getElementById('clienteId').value;
    const documento = document.getElementById('documento').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    // Nivel 4: Validaciones básicas
    if (!documento || !nombres || !apellidos) {
        mostrarMensaje('Por favor, complete los campos obligatorios (*).', 'danger');
        return;
    }

    // Nivel 6: Lógica de Negocio - Validar duplicados
    const duplicado = clientes.find(c => c.documento === documento && c.id !== idField);
    if (duplicado) {
        mostrarMensaje(`Error: El documento ${documento} ya se encuentra registrado.`, 'danger');
        return;
    }

    if (modoEdicion) {
        // Actualizar cliente existente[cite: 7]
        clientes = clientes.map(c => 
            c.id === idField 
            ? { id: c.id, documento, nombres, apellidos, telefono, correo, direccion } 
            : c
        );
        mostrarMensaje('Cliente actualizado correctamente.', 'success');
    } else {
        // Nivel 6: Generación de ID (Cálculo de valores) y registro de nuevo cliente[cite: 7]
        const nuevoId = Date.now().toString(); 
        const nuevoCliente = { id: nuevoId, documento, nombres, apellidos, telefono, correo, direccion };
        clientes.push(nuevoCliente);
        mostrarMensaje('Cliente registrado exitosamente.', 'success');
    }

    resetearFormulario();
    renderizarTabla();
}

// Nivel 4: Modificación dinámica de elementos del DOM
function renderizarTabla() {
    tablaClientes.innerHTML = ''; // Limpiar tabla

    if (clientes.length === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.classList.add('fade-in'); // Nivel 5: Animaciones UX
            
            // Renderizado de datos consultados[cite: 7]
            tr.innerHTML = `
                <td class="fw-bold">${cliente.documento}</td>
                <td>${cliente.nombres} ${cliente.apellidos}</td>
                <td>
                    <div><small>📞 ${cliente.telefono || 'N/A'}</small></div>
                    <div><small>📧 ${cliente.correo || 'N/A'}</small></div>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="cargarDatosEdicion('${cliente.id}')">✏️ Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente('${cliente.id}')">🗑️ Borrar</button>
                </td>
            `;
            tablaClientes.appendChild(tr);
        });
    }

    // Actualizar cálculo de métricas
    totalClientesBadge.textContent = `${clientes.length} Registrados`;
}

// Preparar formulario para Modificar/Actualizar[cite: 7]
function cargarDatosEdicion(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('documento').value = cliente.documento;
    document.getElementById('nombres').value = cliente.nombres;
    document.getElementById('apellidos').value = cliente.apellidos;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('correo').value = cliente.correo;
    document.getElementById('direccion').value = cliente.direccion;

    // Cambios de estado UX
    modoEdicion = true;
    formTitle.textContent = 'Actualizar Cliente';
    document.getElementById('btnSubmit').innerHTML = '🔄 Actualizar Datos';
    btnCancel.classList.remove('d-none');
}

function eliminarCliente(id) {
    if(confirm('¿Está seguro de eliminar este registro?')) {
        clientes = clientes.filter(c => c.id !== id);
        mostrarMensaje('Cliente eliminado del sistema.', 'warning');
        renderizarTabla();
    }
}

function resetearFormulario() {
    formulario.reset();
    document.getElementById('clienteId').value = '';
    modoEdicion = false;
    formTitle.textContent = 'Registrar Cliente';
    document.getElementById('btnSubmit').innerHTML = '💾 Guardar Cliente';
    btnCancel.classList.add('d-none');
}

// Nivel 5: UX - Retroalimentación inmediata y mensajes dinámicos
function mostrarMensaje(texto, tipo) {
    msgContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show fade-in" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-ocultar mensaje después de 4 segundos
    setTimeout(() => {
        const alertNode = document.querySelector('.alert');
        if(alertNode) {
            alertNode.classList.remove('show');
            setTimeout(() => alertNode.remove(), 150); // esperar transición CSS
        }
    }, 4000);
}

// Inicialización de la vista
renderizarTabla();