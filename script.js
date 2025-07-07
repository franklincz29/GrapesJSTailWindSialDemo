//Incrustar el header en todas las páginas
fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
  });

document.addEventListener('DOMContentLoaded', () => {
  // Login
  const loginForm = document.querySelector('form[action="login"]') || document.querySelector('form.login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipoUsuario = loginForm.querySelector('select').value;
      const email = loginForm.querySelector('input[type="email"]').value;

      // Guardar en localStorage
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('emailUsuario', email);

      mostrarModal(`¡Hola ${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}!`,
        `Has iniciado sesión con el correo: <strong>${email}</strong>`);

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
      const tipoUsuario = registerForm.querySelector('select').value;
      const nombre = registerForm.querySelector('input[placeholder="Nombre"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;

      mostrarModal("¡Registro exitoso!",
        `Te registraste como <strong>${tipoUsuario}</strong><br>Nombre: <strong>${nombre}</strong><br>Email: <strong>${email}</strong>`);
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('logueado');
      localStorage.removeItem('tipoUsuario');
      localStorage.removeItem('emailUsuario');
      window.location.href = 'login.html';
    });
  }
});

//MOdal
function mostrarModal(titulo, mensaje) {
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const modal = document.createElement('div');
  modal.className = "bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center";
  modal.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${titulo}</h2>
    <p class="mb-6">${mensaje}</p>
    <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded" onclick="this.closest('.fixed').remove()">Cerrar</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', () => {
  const userType = localStorage.getItem('tipoUsuario');
  const email = localStorage.getItem('emailUsuario');

  const userTypeSpan = document.getElementById('userType');
  const emailSpan = document.getElementById('userEmail');
  if (userTypeSpan && emailSpan) {
    userTypeSpan.textContent = userType;
    emailSpan.textContent = email;
  }
});
