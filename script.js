// Cargar el efecto loader
fetch('loader.html')
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

function ocultarLoader(loader) {
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1000);//Forzar el efecto a que sea visible
}

// Cargar el header
fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;

    // Una vez cargado el header, insertar el botón solo si está logueado
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

// Toda la lógica DOM 
document.addEventListener('DOMContentLoaded', () => {
  // Login
  const loginForm = document.querySelector('form[action="login"]') || document.querySelector('form.login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipoUsuario = loginForm.querySelector('select[name="tipoUsuario"]').value;
      const tipoIdentificacion = loginForm.querySelector('select[name="tipoIdentificacion"]').value;
      const email = loginForm.querySelector('input[type="email"]').value;
      const nombre = localStorage.getItem('nombre');
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('tipoIdentificacion', tipoIdentificacion);
      localStorage.setItem('emailUsuario', email);

      mostrarModal(
        `¡Hola ${nombre ? (nombre + ' ') : ''}${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}!`,
        `Has iniciado sesión con el correo: <strong>${email}</strong>`
      );

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    });
  }

  // Registro
  const registerForm = document.querySelector('form[action="register"]') || document.querySelector('form.register');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipoUsuario = registerForm.querySelector('select[name="tipoUsuario"]').value;
      const tipoIdentificacion = registerForm.querySelector('select[name="tipoIdentificacion"]').value;
      const nombre = registerForm.querySelector('input[placeholder="Nombre"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;

      localStorage.setItem('logueado', 'true');
      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('tipoIdentificacion', tipoIdentificacion);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('emailUsuario', email);

      mostrarModal("¡Registro exitoso!",
        `Te registraste como: <strong>${tipoUsuario}</strong> con identificación tipo: <strong>${tipoIdentificacion}</strong><br>Nombre: <strong>${nombre}</strong><br>Email: <strong>${email}</strong>`,
        'login.html');
    });
  }

  // Cambiar el placeholder del número de identificación en login y register
  document.querySelectorAll('.tipo-id').forEach(select => {
    select.addEventListener('change', (e) => {
      const input = select.parentElement.querySelector('.numero-id');
      if (!input) return;
      input.placeholder = e.target.value === 'cedula' ? '00-0000-0000' : '00-0000-0000-0000';
    });
  });

  // Botón de logout adicional si existe en el HTML directo
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Mostrar datos en dashboard.html
  const userTypeSpan = document.getElementById('userType');
  const emailSpan = document.getElementById('userEmail');
  if (userTypeSpan && emailSpan) {
    userTypeSpan.textContent = localStorage.getItem('tipoUsuario');
    emailSpan.textContent = localStorage.getItem('emailUsuario');
  }

  // Redirección automática si no está logueado y es dashboard
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

// Función utilitaria logout
function logout() {
  ['logueado', 'tipoUsuario', 'tipoIdentificacion', 'emailUsuario', 'nombre'].forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Swiper para ofertas
  const swiperOfertas = new Swiper('.mySwiperOfertas', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    pagination: {
      el: '.mySwiperOfertas .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.mySwiperOfertas .swiper-button-next',
      prevEl: '.mySwiperOfertas .swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  // Inicializar Swiper para profesores
  const swiperProfesores = new Swiper('.mySwiperProfesores', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    pagination: {
      el: '.mySwiperProfesores .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.mySwiperProfesores .swiper-button-next',
      prevEl: '.mySwiperProfesores .swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
});
