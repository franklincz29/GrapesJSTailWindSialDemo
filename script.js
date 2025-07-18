// Detectar base path de GitHub Pages
const pathParts = window.location.pathname.split('/');
let projectBase = '/GrapesJSTailWindSialDemo/';

if (pathParts.length > 1 && pathParts[1]) {
  projectBase = '/' + pathParts[1] + '/';
}

// Cargar el efecto loader
fetch(projectBase + 'loader.html')
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

// Cargar el header
fetch(projectBase + 'header.html')
  .then(response => response.text())
  .then(html => {
    // Ajustar dinámicamente los paths del header
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    //Para las <a>
    tempDiv.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        a.setAttribute('href', projectBase + href);
      }
    });
    //Para las <img>
    tempDiv.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('#')) {
        img.setAttribute('src', projectBase + src);
      }
    });

    document.getElementById('header-placeholder').innerHTML = tempDiv.innerHTML;

    // Agregar botón de logout si está logueado
    if (localStorage.getItem('logueado') === 'true') {
      const userActions = document.getElementById('user-actions');
      if (userActions) {
        //Link al dashboard cuando se esta logueado
        const dashboarLink = document.createElement('a');
        dashboarLink.textContent = 'Dashboard';
        dashboarLink.className = 'mr-5 hover:text-black-900';
        dashboarLink.href = projectBase + 'dashboard.html';
        //Boton para cerrar sesion
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Cerrar sesión';
        logoutBtn.className = 'ml-4 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600';
        logoutBtn.addEventListener('click', logout);
        //Agregarlos al header
        userActions.appendChild(dashboarLink);
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
  }, 1000);//Forzar al efecto de loading para que sea visible (antes solo se veia en contact)
}

// Toda la lógica DOM
//(Document Object Model)
//Estandar para acceder al contenido HTML desde JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Contacto
  const contactoForm = document.getElementById('contactoForm');
  if (contactoForm) {
    contactoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      mostrarModal(
        'Mensaje enviado',
        '¡Gracias por contactarnos! Tu mensaje se envió correctamente.'
      );
      contactoForm.reset();
    });
  }
  //Validaciones del los formulario de registro y login
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
        window.location.href = projectBase + 'dashboard.html';
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
        projectBase + 'login.html');
    });
  }

  document.querySelectorAll('.tipo-id').forEach(select => {
    select.addEventListener('change', (e) => {
      const input = select.parentElement.querySelector('.numero-id');
      if (!input) return;
      input.placeholder = e.target.value === 'cedula' ? '00-0000-0000' : '00-0000-0000-0000';
    });
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  const userTypeSpan = document.getElementById('userType');
  const emailSpan = document.getElementById('userEmail');
  if (userTypeSpan && emailSpan) {
    userTypeSpan.textContent = localStorage.getItem('tipoUsuario');
    emailSpan.textContent = localStorage.getItem('emailUsuario');
  }

  if (window.location.pathname.includes('dashboard.html') && localStorage.getItem('logueado') !== 'true') {
    window.location.href = projectBase + 'index.html';
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

  modal.querySelector('#modal-close-btn').addEventListener('click', () => {
    overlay.remove();
    if (redirigir) {
      window.location.href = redirigir;
    }
  });
}

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
    window.location.href = projectBase + 'dashboard.html';
  });
}

// Función logout 
function logout() {
  ['logueado', 'tipoUsuario', 'tipoIdentificacion', 'numeroIdentificacion', 'emailUsuario', 'nombre'].forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.href = projectBase + 'index.html';
}
// Carrusel de Ofertas
const carouselOfertas = document.getElementById('carouselOfertas');
const imagesOfertas = carouselOfertas.children;
let indexOfertas = 0;

document.getElementById('nextOfertas').addEventListener('click', () => {
    indexOfertas = (indexOfertas + 1) % imagesOfertas.length;
    updateCarousel(carouselOfertas, indexOfertas);
});

document.getElementById('prevOfertas').addEventListener('click', () => {
    indexOfertas = (indexOfertas - 1 + imagesOfertas.length) % imagesOfertas.length;
    updateCarousel(carouselOfertas, indexOfertas);
});

// Carrusel de Candidatos
const carouselCandidatos = document.getElementById('carouselCandidatos');
const imagesCandidatos = carouselCandidatos.children;
let indexCandidatos = 0;

document.getElementById('nextCandidatos').addEventListener('click', () => {
    indexCandidatos = (indexCandidatos + 1) % imagesCandidatos.length;
    updateCarousel(carouselCandidatos, indexCandidatos);
});

document.getElementById('prevCandidatos').addEventListener('click', () => {
    indexCandidatos = (indexCandidatos - 1 + imagesCandidatos.length) % imagesCandidatos.length;
    updateCarousel(carouselCandidatos, indexCandidatos);
});

// Función común para ambos
function updateCarousel(carousel, index) {
    const offset = -index * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}
