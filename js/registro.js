// Agrega un evento click a todas las etiquetas <a> con la clase "btn-wsp"
var btnsWsp = document.querySelectorAll("a.btn-wsp");
btnsWsp.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    // Número de WhatsApp al que se redirigirá
    var numeroWhatsApp = "+51984562234";

    // Mensaje que se enviará
    var mensaje = "Hola, me brindan información de los precios";

    // Crea la URL de WhatsApp con el número y el mensaje
    var urlWhatsApp =
      "https://wa.me/" +
      numeroWhatsApp +
      "?text=" +
      encodeURIComponent(mensaje);

    // Abre WhatsApp en una página aparte
    window.open(urlWhatsApp, "_blank");

    // Evita que el enlace se comporte como un enlace normal
    event.preventDefault();
  });
});
