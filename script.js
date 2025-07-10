// Detectar base path para carga de archivos externos
const pathParts = window.location.pathname.split('/');
let basePath = './'; // por defecto para archivos en la raíz

if (pathParts.length > 2) {
  // Si está en subcarpeta, subir un nivel (o más según necesidad)
  basePath = '../'.repeat(pathParts.length - 2);
}

// Luego usa basePath para cargar loader y header

fetch(basePath + 'loader.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('loader-placeholder').innerHTML = html;
    const loader = document.getElementById('loader');
    if (document.readyState === 'complete') {
      ocultarLoader(loader);
    } else {
      window.addEventListener('load', () => ocultarLoader(loader));
    }
  });

fetch(basePath + 'header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;

    if (localStorage.getItem('logueado') === 'true') {
      const userActions = document.getElementById('user-actions');
      if (userActions) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Cerrar sesión';
        logoutBtn.className = 'ml-4 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600';
        logoutBtn.addEventListener('click', logout);
        userActions.appendChild(logoutBtn);
      }
    }
  });

  function ocultarLoader(loader) {
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1000); // Forzar el efecto a que sea visible
}

// Toda la lógica DOM
document.addEventListener('DOMContentLoaded', () => {
  const contactoForm = document.getElementById('contactoForm');
  if (contactoForm) {
    contactoForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevenir envío real (porque no tengo backend)
      
      mostrarModal(
        'Mensaje enviado',
        '¡Gracias por contactarnos! Tu mensaje se envió correctamente.'
      );
      contactoForm.reset();
    });
  }

  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function limpiarNumero(numero) {
    return numero.replace(/\D/g, '');
  }

  function formatearIdentificacion(tipo, numero) {
    if (tipo === 'cedula') {
      return `${numero.slice(0, 2)}-${numero.slice(2, 6)}-${numero.slice(6, 10)}`;
    } else if (tipo === 'pasaporte') {
      return `${numero.slice(0, 2)}-${numero.slice(2, 6)}-${numero.slice(6, 10)}-${numero.slice(10, 14)}`;
    }
    return numero;
  }

  function validarIdentificacion(tipo, numero) {
    numero = limpiarNumero(numero);
    if (tipo === 'cedula') {
      return numero.length === 9;
    } else if (tipo === 'pasaporte') {
      return numero.length === 13;
    }
    return false;
  }

  // LOGIN
  const loginForm = document.querySelector('form[action="login"]') || document.querySelector('form.login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const tipoUsuario = loginForm.querySelector('select[name="tipoUsuario"]').value;
      const tipoIdentificacion = loginForm.querySelector('select[name="tipoIdentificacion"]').value;
      const numeroIdentificacionInput = loginForm.querySelector('.numero-id').value.trim();
      const numeroIdentificacion = limpiarNumero(numeroIdentificacionInput);
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value.trim();

      if (!tipoUsuario) return alert('Por favor selecciona un tipo de usuario.');
      if (!tipoIdentificacion) return alert('Por favor selecciona un tipo de identificación.');
      if (!validarIdentificacion(tipoIdentificacion, numeroIdentificacion))
        return alert(`Número de identificación inválido para ${tipoIdentificacion === 'cedula' ? 'cédula' : 'pasaporte'}.`);
      if (!validarEmail(email)) return alert('Por favor ingresa un email válido.');
      if (!password || password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');

      const numeroFormateado = formatearIdentificacion(tipoIdentificacion, numeroIdentificacion);

      const nombre = localStorage.getItem('nombre');
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('tipoIdentificacion', tipoIdentificacion);
      localStorage.setItem('numeroIdentificacion', numeroFormateado);
      localStorage.setItem('emailUsuario', email);

      mostrarModal(
        `¡Hola ${nombre ? (nombre + ' ') : ''}${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}!`,
        `Has iniciado sesión con:<br>
         Tipo ID: <strong>${tipoIdentificacion}</strong><br>
         Número ID: <strong>${numeroFormateado}</strong><br>
         Email: <strong>${email}</strong>`
      );

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    });
  }

  // REGISTRO
  const registerForm = document.querySelector('form[action="register"]') || document.querySelector('form.register');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const tipoUsuario = registerForm.querySelector('select[name="tipoUsuario"]').value;
      const tipoIdentificacion = registerForm.querySelector('select[name="tipoIdentificacion"]').value;
      const numeroIdentificacionInput = registerForm.querySelector('.numero-id').value.trim();
      const numeroIdentificacion = limpiarNumero(numeroIdentificacionInput);
      const nombre = registerForm.querySelector('input[placeholder="Nombre"]').value.trim();
      const email = registerForm.querySelector('input[type="email"]').value.trim();
      const password = registerForm.querySelector('input[type="password"]').value.trim();

      if (!tipoUsuario) return alert('Por favor selecciona un tipo de usuario.');
      if (!tipoIdentificacion) return alert('Por favor selecciona un tipo de identificación.');
      if (!validarIdentificacion(tipoIdentificacion, numeroIdentificacion))
        return alert(`Número de identificación inválido para ${tipoIdentificacion === 'cedula' ? 'cédula' : 'pasaporte'}.`);
      if (!nombre) return alert('Por favor ingresa tu nombre.');
      if (!validarEmail(email)) return alert('Por favor ingresa un email válido.');
      if (!password || password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');

      const numeroFormateado = formatearIdentificacion(tipoIdentificacion, numeroIdentificacion);

      localStorage.setItem('logueado', 'true');
      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('tipoIdentificacion', tipoIdentificacion);
      localStorage.setItem('numeroIdentificacion', numeroFormateado);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('emailUsuario', email);

      mostrarModal("¡Registro exitoso!",
        `Te registraste como: <strong>${tipoUsuario}</strong><br>
         Tipo ID: <strong>${tipoIdentificacion}</strong><br>
         Número ID: <strong>${numeroFormateado}</strong><br>
         Nombre: <strong>${nombre}</strong><br>
         Email: <strong>${email}</strong>`,
        'login.html');
    });
  }

  // Cambiar placeholder del input ID según tipo
  document.querySelectorAll('.tipo-id').forEach(select => {
    select.addEventListener('change', (e) => {
      const input = select.parentElement.querySelector('.numero-id');
      if (!input) return;
      input.placeholder = e.target.value === 'cedula' ? '00-0000-0000' : '00-0000-0000-0000';
    });
  });

  // Botón logout en HTML directo
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Mostrar datos en dashboard
  const userTypeSpan = document.getElementById('userType');
  const emailSpan = document.getElementById('userEmail');
  if (userTypeSpan && emailSpan) {
    userTypeSpan.textContent = localStorage.getItem('tipoUsuario');
    emailSpan.textContent = localStorage.getItem('emailUsuario');
  }

  // Redirección si no está logueado
  if (window.location.pathname.includes('dashboard.html') && localStorage.getItem('logueado') !== 'true') {
    window.location.href = 'index.html';
  }
});

// Modal reutilizable
function mostrarModal(titulo, mensaje, redirigir = null) {
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const modal = document.createElement('div');
  modal.className = "bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center";
  modal.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${titulo}</h2>
    <p class="mb-6">${mensaje}</p>
    <button id="modal-close-btn" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">Cerrar</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeBtn = modal.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    if (redirigir) {
      window.location.href = redirigir;
    }
  });
}

//Modal de aplicar oferta
function mostrarModalAplicacion() {
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const modal = document.createElement('div');
  modal.className = "bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center";
  modal.innerHTML = `
                <h2 class="text-xl font-bold mb-4">¡Aplicación enviada!</h2>
                <p class="mb-6">¡Tu aplicación ha sido registrada exitosamente!</p>
                <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">Cerrar</button>
            `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector('button').addEventListener('click', () => {
    overlay.remove();
    window.location.href = '/dashboard.html'; 
  });
}

// Función logout
function logout() {
  ['logueado', 'tipoUsuario', 'tipoIdentificacion', 'numeroIdentificacion', 'emailUsuario', 'nombre'].forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.href = 'index.html';
}
