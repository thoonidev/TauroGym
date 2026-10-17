document.addEventListener("DOMContentLoaded", () => {
  const abrir = document.getElementById("abrir-carrito");
  const panel = document.getElementById("carrito-panel");
  const lista = panel.querySelector(".lista_de_clases");
  const contador = document.getElementById("contador-carrito");
  const resumen = panel.querySelector(".carrito-resumen");
  const aviso = document.getElementById("carrito-aviso");
  const error = document.getElementById("carrito-error");
  const clases = new Map();
  const moneda = (valor) => `S/${valor.toFixed(2)}`;
  let avisoTemporizador;
  let anteriorFoco;

  const total = () =>
    [...clases.values()].reduce(
      (suma, clase) => suma + clase.precio * clase.cantidad,
      0,
    );
  const sesiones = () =>
    [...clases.values()].reduce((suma, clase) => suma + clase.cantidad, 0);

  abrir.addEventListener("click", () => {
    anteriorFoco = document.activeElement;
    panel.showModal();
    document.body.classList.add("carrito-abierto");
  });
  panel
    .querySelector(".carrito-cerrar")
    .addEventListener("click", () => panel.close());
  panel.addEventListener("click", (event) => {
    if (event.target !== panel) return;
    const rect = panel.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      panel.close();
  });
  panel.addEventListener("close", () => {
    document.body.classList.remove("carrito-abierto");
    anteriorFoco?.focus({ preventScroll: true });
  });
  panel
    .querySelector(".carrito-explorar")
    .addEventListener("click", () => panel.close());

  function anunciar(mensaje) {
    clearTimeout(avisoTemporizador);
    aviso.textContent = mensaje;
    avisoTemporizador = setTimeout(() => {
      aviso.textContent = "";
    }, 3000);
  }

  function renderizar() {
    lista.replaceChildren();
    for (const clase of clases.values()) {
      const fila = document.createElement("li");
      fila.className = "carrito-item";
      fila.dataset.id = clase.id;
      const foto = document.createElement("img");
      foto.src = clase.imagen;
      foto.alt = "";
      const detalle = document.createElement("div");
      const titulo = document.createElement("h3");
      titulo.textContent = clase.titulo;
      const precio = document.createElement("p");
      precio.className = "carrito-unitario";
      precio.textContent = `${moneda(clase.precio)} por sesión`;
      const subtotal = document.createElement("strong");
      subtotal.className = "carrito-item-total";
      subtotal.textContent = moneda(clase.precio * clase.cantidad);
      const controles = document.createElement("div");
      controles.className = "carrito-controles";
      const cantidad = document.createElement("div");
      cantidad.className = "carrito-cantidad";
      for (const [accion, texto, etiqueta] of [
        ["menos", "−", "Reducir sesiones"],
        ["mas", "+", "Aumentar sesiones"],
      ]) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.accion = accion;
        boton.textContent = texto;
        boton.setAttribute("aria-label", `${etiqueta} de ${clase.titulo}`);
        boton.disabled = accion === "menos" && clase.cantidad === 1;
        cantidad.append(boton);
        if (accion === "menos") {
          const valor = document.createElement("span");
          valor.textContent = clase.cantidad;
          valor.setAttribute("aria-label", `${clase.cantidad} sesiones`);
          cantidad.append(valor);
        }
      }
      const eliminar = document.createElement("button");
      eliminar.type = "button";
      eliminar.className = "carrito-eliminar";
      eliminar.dataset.accion = "eliminar";
      eliminar.textContent = "Eliminar";
      eliminar.setAttribute("aria-label", `Eliminar ${clase.titulo}`);
      controles.append(cantidad, eliminar);
      detalle.append(titulo, precio, subtotal, controles);
      fila.append(foto, detalle);
      lista.append(fila);
    }
    contador.textContent = sesiones();
    abrir.setAttribute("aria-label", `Abrir carrito, ${sesiones()} sesiones`);
    document.getElementById("total-sesiones").textContent = sesiones();
    panel.querySelector(".suma-total").textContent = moneda(total());
    resumen.hidden = clases.size === 0;
    panel.querySelector(".carrito-vacio").hidden = clases.size > 0;
    lista.hidden = clases.size === 0;
    error.textContent = "";
  }

  document.getElementById("lista-clases").addEventListener("click", (event) => {
    const boton = event.target.closest(".agregar-carrito");
    if (!boton) return;
    const tarjeta = boton.closest(".items");
    const id = boton.dataset.id;
    if (clases.has(id)) clases.get(id).cantidad++;
    else
      clases.set(id, {
        id,
        titulo: tarjeta.querySelector("h3").textContent.trim(),
        imagen: tarjeta.querySelector("img").src,
        precio: Number(
          tarjeta.querySelector(".precio-clase").textContent.replace("S/", ""),
        ),
        cantidad: 1,
      });
    renderizar();
    anunciar(`${clases.get(id).titulo}: sesión agregada al carrito.`);
  });

  lista.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) return;
    const id = boton.closest(".carrito-item").dataset.id;
    const clase = clases.get(id);
    const accion = boton.dataset.accion;
    const ids = [...clases.keys()];
    const siguiente = ids[ids.indexOf(id) + 1] || ids[ids.indexOf(id) - 1];
    if (accion === "eliminar") clases.delete(id);
    else
      clase.cantidad = Math.max(
        1,
        clase.cantidad + (accion === "mas" ? 1 : -1),
      );
    renderizar();
    const fila = [...lista.children].find(
      (item) => item.dataset.id === (clases.has(id) ? id : siguiente),
    );
    const foco =
      fila?.querySelector(`[data-accion="${accion}"]:not(:disabled)`) ||
      fila?.querySelector('[data-accion="mas"]') ||
      panel.querySelector(".carrito-explorar");
    foco.focus();
    anunciar(
      `Carrito actualizado: ${sesiones()} sesiones, total ${moneda(total())}.`,
    );
  });

  document.getElementById("vaciar_carrito").addEventListener("click", () => {
    clases.clear();
    renderizar();
    panel.querySelector(".carrito-explorar").focus();
    anunciar("Carrito vacío.");
  });

  document.getElementById("generar-pdf").addEventListener("click", () => {
    if (!clases.size) return;
    if (typeof window.jsPDF !== "function") {
      error.textContent =
        "No se pudo cargar la descarga. Recarga la página e inténtalo de nuevo.";
      return;
    }
    const doc = new window.jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("TAURO GYM - RESUMEN DE CLASES", 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-PE")}`, 14, 34);
    let y = 52;
    for (const clase of clases.values()) {
      if (y > 245) {
        doc.addPage();
        y = 22;
      }
      doc.text(clase.titulo, 14, y);
      doc.text(
        `${clase.cantidad} sesiones x ${moneda(clase.precio)} = ${moneda(clase.precio * clase.cantidad)}`,
        14,
        y + 8,
      );
      y += 26;
    }
    if (y > 245) {
      doc.addPage();
      y = 22;
    }
    doc.text(`Sesiones: ${sesiones()}`, 14, y + 4);
    doc.text(`Total: ${moneda(total())}`, 14, y + 14);
    doc.save("TauroGym-resumen.pdf");
  });
  renderizar();
});
