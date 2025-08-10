let certificadosGlobal = []; 
let indiceInicio = 0;        
const cantidadPorPagina = 2; 

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const proyectos = await cargarJson("./data/proyectos.json");
    renderizarProyectos(proyectos);
    const experiencias = await cargarJson("./data/experiencias.json");
    renderizarExperiencia(experiencias);
    const habilidades = await cargarJson("./data/habilidades.json");
    renderizarHabilidades(habilidades);
    certificadosGlobal = await cargarJson("./data/certificados.json"); 
    renderizarCertificados();
  } catch (err) {
    console.error("Error al cargar los proyectos:", err);
  }

  scrollTarget();
  const btn = document.getElementById("buttonContacto");

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validarForm()) return;
    btn.innerHTML = '<i class="bi bi-send"></i> Enviando...';
    btn.disabled = true;

    const serviceID = "default_service";
    const templateID = "template_z3irdwa";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        btn.innerHTML = '<i class="bi bi-send"></i> Enviar mensaje';
        btn.disabled = false;
        alertaMSG("Mensaje enviado con exito");
        limpiarForm();
      },
      (err) => {
        btn.innerHTML = '<i class="bi bi-send"></i> Error al enviar';
        btn.disabled = false;
        alertaMSG("Error al enviar", "danger");
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

function renderizarCertificados() {
  const container = document.getElementById("certificados-container");
  container.innerHTML = "";

  const certificadosMostrar = certificadosGlobal.slice(
    indiceInicio,
    indiceInicio + cantidadPorPagina
  );

  certificadosMostrar.forEach((cert) => {
    container.innerHTML += `
      <div class="col-lg col-md-6">
        <div class="card card-certificado h-100 border-0">
          <div class="card-img-overlay d-flex align-items-center justify-content-center overlay-title">
            <h5 class="text-white text-center fw-bold m-0">${cert.titulo}</h5>
          </div>
          <a href="${cert.pdf}" target="_blank">
            <img src="${cert.imagen}" class="card-img-top img-certificado" alt="${cert.titulo}" />
          </a>
        </div>
      </div>
    `;
  });

  actualizarEstadoBotones();
}

function actualizarEstadoBotones() {
  document.getElementById("btn-anterior").disabled = indiceInicio === 0;
  document.getElementById("btn-siguiente").disabled =
    indiceInicio + cantidadPorPagina >= certificadosGlobal.length;
}

document.getElementById("btn-anterior").addEventListener("click", () => {
  if (indiceInicio > 0) {
    indiceInicio -= cantidadPorPagina;
    renderizarCertificados();
  }
});

document.getElementById("btn-siguiente").addEventListener("click", () => {
  if (indiceInicio + cantidadPorPagina < certificadosGlobal.length) {
    indiceInicio += cantidadPorPagina;
    renderizarCertificados();
  }
});


function renderizarHabilidades(habilidades) {
  const container = document.getElementById("skills-container");

  habilidades.forEach((hab) => {
    container.innerHTML += `
      <div class="col-12 col-lg-6">
        <div class="bg-dark p-4 rounded shadow-sm border-bottom ">
          <h5><i class="bi ${hab.icon} me-2 "></i>${hab.title}</h5>
          <p class="color-base mb-0">${hab.tools}</p>
        </div>
      </div>
    `;
  });
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
          <div class="card-body bg-dark text-center">
            <h5 class="card-title text-info fw-bold">${proyecto.titulo}</h5>
            <p class="card-text small">${proyecto.descripcion}</p>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-3">
              ${tecnologiasHTML}
            </div>

            <div class="d-flex justify-content-center gap-3 flex-wrap mt-4">
              <a href="${proyecto.botones.demo.url}" class="btn-carrousel btn-demo btn-sm" target="_blank">
                <i class="bi bi-link-45deg"></i> ${proyecto.botones.demo.texto}
              </a>
              <a href="${proyecto.botones.codigo.url}" class="btn-carrousel btn-custom btn-sm" target="_blank">
                <i class="bi bi-github i-codigo"></i> ${proyecto.botones.codigo.texto}
              </a>
              <a href="${proyecto.botones.diseño.url}" class="btn-carrousel btn-custom btn-sm" target="_blank">
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
      <span class="timeline-dot timeline-color"></span>
      <div class="timeline-content bg-dark timeline-border">
        <p class="date mb-2 color-base">
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
  document.getElementById("form").reset();
  document
    .querySelectorAll(".is-valid")
    .forEach((input) => input.classList.remove("is-valid"));
};

const alertaMSG = (message, type = "success") => {
  const alertPlaceholder = document.getElementById("alerta"); // contenedor de la alerta

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    const alertNode = wrapper.querySelector(".alert");
    if (alertNode) alertNode.remove();
  }, 3000);
};

const validarForm = () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  let isValid = true;

  if (name.value.trim() === "" || name.value.length < 3) {
    setInvalid(name, "El nombre debe tener al menos 3 caracteres");
    isValid = false;
  } else setValid(name);

  if (email.value.trim() === "" || !validateEmail(email.value)) {
    setInvalid(email, "Ingrese un email válido");
    isValid = false;
  } else setValid(email);

  if (message.value.trim() === "") {
    setInvalid(message, "El mensaje no puede estar vacío");
    isValid = false;
  } else setValid(message);

  return isValid;
};

function setInvalid(input, message) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");

  // Si ya existe mensaje, lo reemplazamos
  let feedback = input.parentElement.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    input.parentElement.appendChild(feedback);
  }
  feedback.textContent = message;
}

function setValid(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");

  // Eliminar feedback de error si existe
  const feedback = input.parentElement.querySelector(".invalid-feedback");
  if (feedback) feedback.remove();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function scrollTarget() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const offset = 100; // altura del navbar fijo

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });
}
