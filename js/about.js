var cierre = localStorage.getItem("autentication");
// Verificar si el usuario no está autenticado y redirigirlo a la página de inicio
if (cierre == "no") {
    location.href = "file:///C:/Users/juand/OneDrive/Escritorio/riwithinkcodev3/index.html";
}

// Función para cambiar el tema y la imagen
function recibir() {
    let img = document.getElementById('img');
    let check = document.getElementById('checkbox');
    let body = document.getElementById('body');
    // Verificar si el checkbox está marcado
    if (check.checked) {
        // Agregar la clase oscuro al cuerpo y cambiar la imagen
        body.classList.add('oscuro');
        img.setAttribute('src', '../img+/logoRoscuro.png');
    } else {
        // Quitar la clase oscuro al cuerpo y cambiar la imagen
        body.classList.remove('oscuro');
        img.setAttribute('src', '../img+/R.png');
    }
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

// Función para cerrar sesión
function cerrarsesion(){
    // Redirigir al usuario a la página de inicio y actualizar el estado de autenticación
    location.href = "file:///C:/Users/juand/OneDrive/Escritorio/riwithinkcodev3/index.html";
    localStorage.setItem("autentication","no");
}


