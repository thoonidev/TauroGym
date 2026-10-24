function sendMessage() {
  // Obtener los valores de los campos
  var nombres = document.getElementById("nombres_con").value;
  var apellidos = document.getElementById("apellidos_con").value;
  var telefono = document.getElementById("telefono_con").value;
  var email = document.getElementById("email_con").value;
  var mensaje = document.getElementById("mensaje_con").value;

  // Validar cada campo
  if (
    nombres === "" ||
    apellidos === "" ||
    telefono === "" ||
    email === "" ||
    mensaje === ""
  ) {
    alert("Todos los campos son obligatorios");
    return false;
  }

  // Validar el formato del número de teléfono (9 dígitos)
  var phonePattern = /^\d{9}$/;
  if (!phonePattern.test(telefono)) {
    alert("Ingrese un número de teléfono válido (9 dígitos).");
    return false;
  }

  // Validar el formato del correo electrónico
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    alert("Ingrese el correo electronico válido.");
    return false;
  }

  // Enviar el formulario si todas las validaciones pasan
  alert("Mensaje enviado correctamente");

  // Limpiar los campos del formulario
  document.getElementById("nombres_con").value = "";
  document.getElementById("apellidos_con").value = "";
  document.getElementById("telefono_con").value = "";
  document.getElementById("email_con").value = "";
  document.getElementById("mensaje_con").value = "";
}
