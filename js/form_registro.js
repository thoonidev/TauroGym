function validarFormulario() {
  var nombre = document.getElementById("nombre_reg").value;
  var apellidos = document.getElementById("apellidos_reg").value;
  var telefono = document.getElementById("telefono_reg").value;
  var correo = document.getElementById("correo_reg").value;
  var curso = document.getElementById("curso_reg").value; //

  // Validar que los campos no estén vacíos
  if (nombre === "" || apellidos === "" || telefono === "" || correo === "") {
    alert("Por favor, complete todos los campos.");
    return false;
  }

  // Validar el formato del correo electrónico
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(correo)) {
    alert("Ingrese el correo electronico válido.");
    return false;
  }

  // Validar el formato del número de teléfono (9 dígitos)
  var phonePattern = /^\d{9}$/;
  if (!phonePattern.test(telefono)) {
    alert("Ingrese un número de teléfono válido (9 dígitos).");
    return false;
  }

   // Validar que se haya seleccionado un curso
  if (curso === "seleccionar") {
    alert("Por favor, seleccione un curso.");
    return false;
  }

  // Si todos los campos están validados, mostrar un mensaje de registro exitoso
  alert("¡Registro exitoso!");

  // Enviar el formulario y limpiar después
  enviarFormulario();

  return false;
}

function enviarFormulario() {
  // Obtener el formulario
  var formulario = document.getElementById("registroForm");

  // Enviar el formulario
  formulario.submit();

  // Limpiar el formulario
  formulario.reset();
}
