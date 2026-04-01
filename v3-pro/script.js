/* =====================================================
   CLOCKVIBE PRO — script.js
   Relógio, Temas, PWA & Login Simulado
   ===================================================== */

let currentUser = JSON.parse(localStorage.getItem("clock_user")) || null;

// ── Navegação ──
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add("active");
    window.scrollTo(0, 0);
  }
  
  const activeLink = document.querySelector(`.nav-link[onclick*="${pageId}"]`);
  if (activeLink) activeLink.classList.add("active");
}

// ── Relógio ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  
  const digitalClock = document.getElementById("digital-clock");
  if (digitalClock) digitalClock.innerText = `${h}:${m}:${s}`;
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = document.getElementById("current-date");
  if (currentDate) currentDate.innerText = now.toLocaleDateString('pt-BR', options);

  // Progresso do Dia
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = now - startOfDay;
  const percent = (diff / (24 * 60 * 60 * 1000)) * 100;
  const progressFill = document.getElementById("day-progress-fill");
  if (progressFill) progressFill.style.width = `${percent}%`;
  const progressText = document.getElementById("day-progress-text");
  if (progressText) progressText.innerText = `Dia: ${percent.toFixed(1)}%`;

  // Stats
  const week = Math.ceil((((now - new Date(now.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
  const weekNumber = document.getElementById("week-number");
  if (weekNumber) weekNumber.innerText = `Semana ${week}`;
}

// ── Temas ──
function setTheme(themeName) {
  document.body.className = `theme-${themeName}`;
  localStorage.setItem("clock_theme", themeName);
  initParticles();
}

// ── Fullscreen / Widget ──
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// ── Login Simulado ──
function openLoginModal() {
  if (currentUser) {
    logout();
  } else {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("active");
  }
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.classList.remove("active");
}

function logout() {
  currentUser = null;
  localStorage.removeItem("clock_user");
  updateUI();
}

const loginForm = document.getElementById("formLogin");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    if (email.includes("@")) {
      currentUser = { nome: email.split("@")[0], email: email };
      localStorage.setItem("clock_user", JSON.stringify(currentUser));
      updateUI();
      closeLoginModal();
    }
  });
}

function updateUI() {
  const status = document.getElementById("userStatus");
  if (status) {
    if (currentUser) {
      status.innerText = currentUser.nome;
    } else {
      status.innerText = "Entrar";
    }
  }
}

// ── Partículas (Canvas) ──
const canvas = document.getElementById("particles");
let ctx;
let particles = [];

function initParticles() {
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  const color = getComputedStyle(document.body).getPropertyValue('--primary').trim();
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: color
    });
  }
}

function animateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;
    if (p.y > canvas.height) p.y = 0;
    if (p.y < 0) p.y = canvas.height;
    
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  setInterval(updateClock, 1000);
  updateClock();
  updateUI();
  
  const savedTheme = localStorage.getItem("clock_theme") || "cyberpunk";
  setTheme(savedTheme);
  
  initParticles();
  animateParticles();
  
  window.addEventListener('resize', initParticles);
  showPage("clock");
});
