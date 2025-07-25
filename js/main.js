document.addEventListener("DOMContentLoaded", async function () {
  try {
    const proyectos = await cargarProyectos("./data/proyectos.json");
    renderizarProyectos(proyectos);
  } catch (err) {
    console.error("Error al cargar los proyectos:", err);
  }
});

async function cargarProyectos(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("No se pudo cargar el JSON");
  }
  return await res.json(); 
}

function renderizarProyectos(proyectos) {
  const contenedor = document.getElementById("carousel-content");

  proyectos.forEach((proyecto, index) => {
    const item = document.createElement("div");
    item.className = `carousel-item${index === 0 ? " active" : ""}`;

    const tecnologiasHTML = proyecto.tecnologias
      .map(
        (t) => `
          <i 
            class="${t.icono} fs-4" 
            title="${t.nombre}" 
            style="color: #60A5FA;"
          ></i>
        `
      )
      .join("");

    item.innerHTML = `
      <div class="d-flex justify-content-center py-5">
        <div class="card bg-dark text-white border-0 shadow-lg rounded-4 w-100" style="max-width: 800px;">
          <img src="${proyecto.imagen}" class="card-img-top rounded-top" alt="${proyecto.titulo}">
          <div class="card-body text-center">
            <h5 class="card-title text-info fw-bold">${proyecto.titulo}</h5>
            <p class="card-text small">${proyecto.descripcion}</p>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-3">
              ${tecnologiasHTML}
            </div>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-4">
              <a href="${proyecto.botones.demo.url}" class="${proyecto.botones.demo.estilo} btn-sm" target="_blank">
                <i class="bi bi-play-fill"></i> ${proyecto.botones.demo.texto}
              </a>
              <a href="${proyecto.botones.codigo.url}" class="${proyecto.botones.codigo.estilo} btn-sm" target="_blank">
                <i class="bi bi-code-slash"></i> ${proyecto.botones.codigo.texto}
              </a>
              <a href="${proyecto.botones.diseño.url}" class="${proyecto.botones.diseño.estilo} btn-sm" target="_blank">
                <i class="bi bi-brush"></i> ${proyecto.botones.diseño.texto}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });
}