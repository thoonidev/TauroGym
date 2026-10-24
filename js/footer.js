document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer p");
  if (!footer) return;

  const añoActual = new Date().getFullYear();

  footer.innerHTML = `
    ${añoActual} - 
    <span class="txtRojo">TAURO GYM</span> 
    Todos los derechos reservados
  `;
});
