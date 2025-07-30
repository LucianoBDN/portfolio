document.addEventListener("DOMContentLoaded", async function () {
  try {
    const proyectos = await cargarJson("./data/proyectos.json");
    renderizarProyectos(proyectos);
    const experiencias = await cargarJson("./data/experiencias.json");
    renderizarExperiencia(experiencias);
  } catch (err) {
    console.error("Error al cargar los proyectos:", err);
  }

  const btn = document.getElementById("buttonContacto");

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    btn.innerHTML = '<i class="bi bi-send"></i> Enviando...';
    btn.disabled = true;

    const serviceID = "default_service";
    const templateID = "template_z3irdwa";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        btn.innerHTML = '<i class="bi bi-send"></i> Enviado ✔️';
        btn.disabled = false;
        limpiarForm();
      },
      (err) => {
        btn.innerHTML = '<i class="bi bi-send"></i> Error al enviar';
        btn.disabled = false;
        alert("Error: " + JSON.stringify(err));
      }
    );
  });
});

async function cargarJson(path) {
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
      <img 
        src="${t.icono}" 
        alt="${t.nombre}" 
        title="${t.nombre}" 
        class="img-fluid" 
        style="width: 40px; height: 40px; object-fit: contain;"
      />
    `
      )
      .join("");

    item.innerHTML = `
      <div class="d-flex justify-content-center py-5">
        <div class="card text-white border-0 shadow-lg rounded-4 w-100" style="max-width: 900px;">
          <img src="${proyecto.imagen}" class="card-img-top rounded-top" alt="${proyecto.titulo}">
          <div class="card-body text-center">
            <h5 class="card-title text-info fw-bold">${proyecto.titulo}</h5>
            <p class="card-text small">${proyecto.descripcion}</p>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-3">
              ${tecnologiasHTML}
            </div>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-4">
              <a href="${proyecto.botones.demo.url}" class="btn-carrousel btn-demo btn-sm" target="_blank">
                <i class="bi bi-link-45deg"></i> ${proyecto.botones.demo.texto}
              </a>
              <a href="${proyecto.botones.codigo.url}" class="btn-carrousel btn-code btn-sm" target="_blank">
                <i class="bi bi-github i-codigo"></i> ${proyecto.botones.codigo.texto}
              </a>
              <a href="${proyecto.botones.diseño.url}" class="btn-carrousel btn-desing btn-sm" target="_blank">
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

function renderizarExperiencia(experiencias) {
  const contenedor = document.getElementById("timeline");
  contenedor.innerHTML = "";

  experiencias.forEach((exp) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <span class="timeline-dot"></span>
      <div class="timeline-content">
        <p class="date mb-2">
          <i class="bi bi-calendar3 me-2"></i> ${exp.fecha}
        </p>
        <h5 class="fw-bold text-danger">${exp.puesto}</h5>
        <p class="description">${exp.descripcion}</p>
      </div>
    `;
    contenedor.appendChild(item);
  });
}

const limpiarForm = () => {
  const form = document.getElementById("form").reset();
};

const validarForm = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
}