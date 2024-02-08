var cierre = localStorage.getItem("autentication");
if (cierre == "no") {
    location.href = "https://github.com/DeklanBeckett/RiwiThinkCode/blob/main/index.html";
}
function iniciar() {
    // Obtener los datos del usuario almacenados en el almacenamiento local
    const user = localStorage.getItem("user");
    usuario = JSON.parse(user);
    let search = document.getElementById("search");
    // Insertar elementos HTML para buscar y preguntar
    search.innerHTML =
        `
        <select onfocus="this.size=6;" onblur="this.size=0;" onchange="this.size=1;this.blur()" class="selectCat" name="" id="categoria">
            <option disabled selected value="">Categoria</option>
            <option value="otro">Otro</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="js">JAVASCRIPT</option>
        </select>
        <textarea class="text" name="" id="pregunta" placeholder="¡Bienvenid@ ${usuario.name}! ¿Que deseas preguntar?" cols="30" rows="10"></textarea>
        <button class="preguntar" onclick="pregunta('${usuario.id}')">
            <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                    </svg>
                </div>
            </div>
            <span>Preguntar</span>
        </button>
    `;
}

// Llamar a la función iniciar para configurar la página
iniciar();

// Obtener preguntas y mostrarlas en el aside
fetch('http://localhost:3000/questions')
    .then(r => r.json())
    .then(d => {
        // Obtener usuarios para mostrar los nombres de los que hicieron las preguntas
        fetch('http://localhost:3000/users')
            .then(r => r.json())
            .then(u => {
                let aside = document.getElementById('aside');
                d.reverse();
                d.forEach(element => {
                    let name = "";
                    // Buscar el nombre del usuario que hizo la pregunta
                    u.forEach(e => {
                        if (element.id_usuario == e.id) {
                            name = e.name;
                        }
                    });
                    // Agregar HTML para mostrar las preguntas
                    aside.innerHTML +=
                        `
                        <div class="div_preguntas">
                            <h1 class="h1qs">Esta es pregunta de ${name}</h1>
                            <div class="centrar">
                                <p>${element.pregunta}</p>
                                <button class="buttonG" onclick="responder('${element.id}')">Responder</button>
                            </div>
                            <p class="length" onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                        </div>
                    `;
                });
            });
    });

    function pregunta() {
        // Obtener elementos del DOM para la pregunta y la categoría
        let pregunta = document.getElementById("pregunta");
        let categoria = document.getElementById("categoria");
        // Verificar si la pregunta y la categoría no están vacías
        if (pregunta.value != "" && categoria.value != "") {
            // Crear un objeto para la nueva pregunta
            let nuevaPregunta = {
                id_usuario: usuario.id,
                pregunta: pregunta.value,
                categoria: categoria.value,
                respuestas: []
            };
            // Enviar una solicitud POST para agregar la nueva pregunta
            fetch('http://localhost:3000/questions', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nuevaPregunta)
                })
                .then(r => r.json())
                .then(d => {
                    // Mostrar un mensaje de éxito con SweetAlert
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "Se ha creado una pregunta",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // Recargar la página después de un tiempo
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                });
        } else {
            // Mostrar un mensaje de error si faltan datos para generar la pregunta
            Swal.fire({
                icon: "error",
                title: "Faltan datos al generar la pregunta"
            });
        }
    }
    
function cerrarsesion(){
    location.href = "https://github.com/DeklanBeckett/RiwiThinkCode/blob/main/index.html";
    localStorage.setItem("autentication","no");
}

function responder(id) {
    // Realizar una solicitud para obtener los detalles de la pregunta seleccionada
    fetch("http://localhost:3000/questions/" + id)
        .then((r) => r.json())
        .then((d) => {
            // Obtener la pregunta y mostrarla en el aside
            pregun = d.pregunta;
            let aside = document.getElementById("aside");
            aside.innerHTML = "";
            aside.innerHTML = `
                <div class="input_respuestas">
                    <p>${pregun}</p>
                    <input placeholder="Respuesta" class="inputR" name="text" type="text" id="respuesta_text"/>
                    <input class="inputR" id="respuesta_urlImg" placeholder="Imagen" type="url">
                    <input class="inputR" id="respuesta_urlPag" placeholder="Link" type="url">
                    <button class="buttonG" onclick="respuesta('${d.id}')">Responder</button>
                    <button class="buttonG" onclick="mostrarRespuestas('${d.id}')">Ver respuestas</button>
                </div>
            `;
            document.getElementById("respuesta_text").focus();
        });
}

function respuesta(id) {
    // Obtener elementos del DOM para la respuesta y sus URL opcionales
    let respuesta_text = document.getElementById("respuesta_text");
    let respuesta_urlImg = document.getElementById("respuesta_urlImg");
    let respuesta_urlPag = document.getElementById("respuesta_urlPag");

    // Verificar si el campo de respuesta no está vacío
    if (respuesta_text.value != "") {
        // Crear un objeto para la nueva respuesta
        let nuevaRespuesta = {
            id_usuario: usuario.id,
            name_usuario: usuario.name,
            respuesta: [{
                text: respuesta_text.value,
                img: respuesta_urlImg.value,
                url: respuesta_urlPag.value,
            }],
        };
        
        // Realizar una solicitud para obtener los detalles de la pregunta seleccionada
        fetch("http://localhost:3000/questions/" + id)
            .then((r) => r.json())
            .then((da) => {
                // Agregar la nueva respuesta a la lista de respuestas de la pregunta
                da.respuestas.push(nuevaRespuesta);
                
                questions = {
                    respuestas: da.respuestas
                }
                // Actualizar la pregunta con la nueva lista de respuestas
                fetch(`http://localhost:3000/questions/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(questions),
                })
                .then((r) => r.json())
                .then(dat => {
                    // Mostrar un mensaje de éxito con SweetAlert
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "Se ha creado una respuesta",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // Recargar la página después de un tiempo
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                });
            });
    } else {
        // Mostrar un mensaje de error si faltan datos para generar la respuesta
        Swal.fire({
            icon: "error",
            title: "Faltan datos al generar la respuesta"
        });
    }
}

function mostrarRespuestas(id) {
    // Obtener la pregunta y sus respuestas
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
                        <button class="buttonG" onclick="responder('${d.id}')" id="p_respuesta">Responder</button>
                    </div>
                </div>
                `;
            // ciclo sobre las respuestas y mostrarlas
            d.respuestas.forEach(element => {
                if (element.respuesta[0].text != "" && (element.respuesta[0].img == "" && element.respuesta[0].url == "")) {
                    // Si la respuesta solo tiene texto
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
                    // Si la respuesta tiene texto, imagen y/o URL
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
            })
        })
    // Enfocar el campo de pregunta después de mostrar las respuestas
    document.getElementById("pregunta").focus();
}

function recibir() {
    let img = document.getElementById('img')
    let check = document.getElementById('checkbox');
    let header = document.getElementById('headers');
    let body = document.getElementById('body');

    if (check.checked) {
        body.classList.add('oscuro'); 
        img.setAttribute('src','../img+/logoRoscuro.png')
    } else {
        body.classList.remove('oscuro');
        img.setAttribute('src','../img+/R.png')
        
    }
}
function buscar() {
    // Obtener el valor de búsqueda del input
    let search = document.getElementById('buscar');
    // Realizar una solicitud para obtener todas las preguntas
    fetch('http://localhost:3000/questions')
        .then(r => r.json())
        .then(data => {
            // Realizar una solicitud para obtener todos los usuarios
            fetch('http://localhost:3000/users')
                .then(r => r.json())
                .then(users => {
                    // Filtrar las preguntas que coinciden con la búsqueda
                    let filtro = data.filter(function(usuario) {
                        if (usuario.pregunta) {
                            let pregunta = usuario.pregunta.toLowerCase().includes(search.value.toLowerCase());
                            return pregunta;
                        }
                    });
                    // Limpiar el contenido del aside
                    let aside = document.getElementById('aside');
                    aside.innerHTML = ''; 
                    // Mostrar las preguntas filtradas
                    filtro.forEach(element => {
                        let name = "";
                        users.forEach(user => {
                            if (element.id_usuario == user.id) {
                                name = user.name;
                            }
                        });
                        aside.innerHTML += `
                            <div class="div_preguntas">
                                <h1 class="h1qs">Esta es pregunta de ${name}</h1>
                                <div class="centrar">
                                    <p>${element.pregunta}</p>
                                    <button class="buttonG" onclick="responder('${element.id}')">Responder</button>
                                </div>
                                <p class="length" onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                            </div>
                        `;
                    });
                });
        })
        .catch(error => {
            // Manejar errores de la solicitud fetch
            console.error('Error en la solicitud fetch:', error);
        });
}



function traducir(){
    let selectElement = document.getElementById('select');
    let selectedValue = selectElement.value;
    lang = (selectElement.value == "1") ? 'es' : 'en'; 
    console.log(selectedValue)
    
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
        fetch(url, options)
            .then(res => { return res.json() })
            .then(data => {
                document.body.innerHTML = data.trans;
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
}

function css() {
    // Obtener el elemento aside
    let aside = document.getElementById('aside');
    // Realizar una solicitud para obtener todas las preguntas
    fetch("http://localhost:3000/questions")
        .then(r => r.json())
        .then(data => {
            // Limpiar el contenido del aside
            aside.innerHTML = "";
            // ciclo sobre las preguntas
            data.forEach(element => {
                // Realizar una solicitud para obtener los detalles del usuario que hizo la pregunta
                fetch(`http://localhost:3000/users/${element.id_usuario}`)
                    .then(r => r.json())
                    .then(userData => {
                        // Obtener el nombre del usuario
                        let name = userData.name;
                        // Verificar si la pregunta pertenece a la categoría "css"
                        if (element.categoria === "css") {
                            // Mostrar la pregunta en el aside
                            aside.innerHTML += `
                                <div class="div_preguntas">
                                    <h1 class="h1qs">Esta es pregunta de ${name}</h1>
                                    <div class="centrar">
                                        <p>${element.pregunta}</p>
                                        <button class="buttonG" onclick="responder('${element.id}')">Responder</button>
                                    </div>
                                    <p class="length" onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                                </div>
                            `;
                        }
                    });
            });
        });
}


function html() {
    let aside = document.getElementById('aside');
    fetch("http://localhost:3000/questions")
        .then(r => r.json())
        .then(data => {
            aside.innerHTML = "";
            data.forEach(element => {
                fetch(`http://localhost:3000/users/${element.id_usuario}`)
                    .then(r => r.json())
                    .then(userData => {
                        let name = userData.name;
                        if (element.categoria === "html") {
                            aside.innerHTML += `
                            <div class="div_preguntas">
                            <h1 class="h1qs">esta es pregunta de ${name}</h1>
                            <div class="centrar">
                                <p>${element.pregunta}</p>
                                <button class="buttonG" onclick="responder('${element.id}')">responder</button>
                            </div>
                            <p class="length"onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                        </div>
                            `;
                        }
                    })
                    
            });
        })
}

function js() {
    let aside = document.getElementById('aside');
    fetch("http://localhost:3000/questions")
        .then(r => r.json())
        .then(data => {
            aside.innerHTML = "";
            data.forEach(element => {
                fetch(`http://localhost:3000/users/${element.id_usuario}`)
                    .then(r => r.json())
                    .then(userData => {
                        let name = userData.name;
                        if (element.categoria === "js") {
                            aside.innerHTML += `
                            <div class="div_preguntas">
                            <h1 class="h1qs">esta es pregunta de ${name}</h1>
                            <div class="centrar">
                                <p>${element.pregunta}</p>
                                <button class="buttonG" onclick="responder('${element.id}')">responder</button>
                            </div>
                            <p class="length"onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                        </div>
                            `;
                        }
                    })
                    
            });
        })
}
function atras() {
    // Recargar la pagina
    location.href = "";
}

function otro() {
    let aside = document.getElementById('aside');
    fetch("http://localhost:3000/questions")
        .then(r => r.json())
        .then(data => {
            aside.innerHTML = "";
            data.forEach(element => {
                fetch(`http://localhost:3000/users/${element.id_usuario}`)
                    .then(r => r.json())
                    .then(userData => {
                        let name = userData.name;
                        if (element.categoria === "otro") {
                            aside.innerHTML += `
                            <div class="div_preguntas">
                            <h1 class="h1qs">esta es pregunta de ${name}</h1>
                            <div class="centrar">
                                <p>${element.pregunta}</p>
                                <button class="buttonG" onclick="responder('${element.id}')">responder</button>
                            </div>
                            <p class="length"onclick="mostrarRespuestas('${element.id}')">${element.respuestas.length}<i class="fa-regular fa-comment fa-2xl" style="color: #7609db;"></i></p>
                        </div>
                            `;
                        }
                    })
                    
            });
        })
}
