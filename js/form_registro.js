const registroForm = document.getElementById("registroForm");
const camposRegistro = [...registroForm.querySelectorAll("input, select")];

function validarCampoRegistro(campo) {
  let mensaje = "";
  if (!campo.value.trim()) {
    mensaje =
      campo.tagName === "SELECT"
        ? "Selecciona una clase."
        : "Completa este campo.";
  } else if (campo.id === "telefono_reg" && !/^\d{9}$/.test(campo.value)) {
    mensaje = "Ingresa un celular de 9 dígitos.";
  } else if (campo.type === "email" && !campo.validity.valid) {
    mensaje = "Ingresa un correo electrónico válido.";
  }
  document.getElementById(`error-${campo.id}`).textContent = mensaje;
  campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
  return !mensaje;
}

camposRegistro.forEach((campo) => {
  campo.addEventListener("blur", () => validarCampoRegistro(campo));
  campo.addEventListener("input", () => {
    if (campo.getAttribute("aria-invalid") === "true")
      validarCampoRegistro(campo);
  });
  campo.addEventListener("change", () => validarCampoRegistro(campo));
});

registroForm.addEventListener("submit", (event) => {
  const resultados = camposRegistro.map(validarCampoRegistro);
  if (resultados.includes(false)) {
    event.preventDefault();
    camposRegistro[resultados.indexOf(false)].focus();
  }
});

document.querySelectorAll("[data-curso]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const curso = document.getElementById("curso_reg");
    curso.value = enlace.dataset.curso;
    validarCampoRegistro(curso);
  });
});
