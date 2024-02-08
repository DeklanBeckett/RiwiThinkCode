const user = localStorage.getItem("user");
// Parsear el usuario almacenado en el localStorage
usuario = JSON.parse(user);
// Obtener el ID de usuario
let usuarioid = usuario.id;

// Obtener el  valor de la autenticacion del localStorage
var cierre = localStorage.getItem("autentication");
// Redirigir a la página de inicio si el estado de autenticación es "no"
if (cierre == "no") {
    location.href = "file:///C:/Users/juand/OneDrive/Escritorio/riwithinkcodev3/index.html";
}

// Función para cerrar sesión
function cerrarsesion(){
    location.href = "file:///C:/Users/juand/OneDrive/Escritorio/riwithinkcodev3/index.html";
    localStorage.setItem("autentication","no");
}


let aside = document.getElementById('aside');


fetch("http://localhost:3000/questions")
    .then(r => r.json())
    .then(data => {
        // Filtrar las preguntas realizadas por el usuario actual
        const userQuestions = data.filter(question => question.id_usuario === usuarioid);
        userQuestions.reverse();
        // Ciclo sobre las preguntas del usuario y mostrarlas en el aside
        userQuestions.forEach(element => {
            aside.innerHTML += ` 
                <div class="div_preguntas">
                    <h1 class="h1qs">Mi pregunta</h1>
                    <div class="centrar">
                        <p>${element.pregunta}</p>
                    </div>
                    <div class="eliminar">
                        <button class="button"  onclick="eliminar('${element.id}')">
                            <svg viewBox="0 0 448 512" class="svgIcon">
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                                </path>
                            </svg>
                        </button>
                        <p class="length">${element.respuestas.length}<i onclick="mostrarRespuestas('${element.id}')" class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                    </div>
                </div>`;
        });
    });

// Función para mostrar las respuestas de una pregunta
function mostrarRespuestas(id) {
    fetch("http://localhost:3000/questions/" + id)
        .then(r => r.json())
        .then(d => {
            let aside = document.getElementById("aside");
            aside.innerHTML = "";
            aside.innerHTML = 
            `
            <div class="div_preguntas">
                <div class="centrar">
                    <p>${d.pregunta}</p>
                </div>
            </div>
            `;
            d.respuestas.forEach(element => {
                if (element.respuesta[0].text != "" && (element.respuesta[0].img == "" && element.respuesta[0].url == "")) {
                    aside.innerHTML += `
                        <div class="comment-container">
                            <div class="comment">
                                <div class="comment-author">${element.name_usuario}</div>
                                <div class="comment-resource">
                                    <p>${element.respuesta[0].text}</p><br>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (element.respuesta[0].text != "") {
                    aside.innerHTML += `
                        <div class="comment-container">
                            <div class="comment">
                                <div class="comment-author">${element.name_usuario}</div>
                                <div class="comment-resource">
                                    <p>${element.respuesta[0].text}</p><br>
                                    <img src="${element.respuesta[0].img}" alt="Imagen del recurso">
                                    <a href="${element.respuesta[0].url}" target="_blank">Recurso</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        });
}

// Función para eliminar una pregunta
function eliminar(id) {
    // Realizar una solicitud para eliminar la pregunta con el ID proporcionado
    fetch("http://localhost:3000/questions/"+id ,{method : "DELETE",
        headers:{
            "Content-Type": "application/json"
        }})
        .then(r => r.json())
        .then(data => {
            // Mostrar un mensaje de alerta al usuario
            alert("Se ha eliminado una pregunta");
            // Recargar la página para reflejar los cambios
            location.href="";
        });
}

// Función para traducir el contenido
function traducir() {
    let selectElement = document.getElementById('select');
    let selectedValue = selectElement.value;
    lang = (selectElement.value == "1") ? 'es' : 'en'; 
    console.log(selectedValue);
    
    const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/html';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '0620e8e16cmshfd1c43ab69a5df6p161aa9jsn99dd8c1eff20',
            'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
        },
        body: new URLSearchParams({
            from: 'auto',
            to: lang,
            html: document.body.innerHTML
        })
    };
    // Realizar una solicitud para traducir el contenido
    fetch(url, options)
        .then(res => { return res.json() })
        .then(data => {
            // Reemplazar el contenido traducido en el cuerpo del documento
            document.body.innerHTML = data.trans;
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error en la solicitud:', error);
        });
}
