function ingresa() {
    // Obtener el valor de los campos de entrada
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    // Variable para verificar si las credenciales son correctas
    let credencialesCorrectas = false;

    // Realizar una solicitud a la API para obtener los usuarios
    fetch("http://localhost:3000/users")
        .then(r => { return r.json() })
        .then(data => {
            //ciclo para recibir usuario recibido de la API
            data.forEach(element => {
                // Verificar si el input nombre y la contraseña coinciden con algún usuario
                if (name.value == element.email && password.value == element.password) {
                    // Si las credenciales son correctas, redirigir a otra página y almacenar datos en el almacenamiento local
                    credencialesCorrectas = true;
                    window.location.assign('https://github.com/DeklanBeckett/RiwiThinkCode/blob/main/pages/pp.html');
                    localStorage.setItem("user", JSON.stringify(element));
                    localStorage.setItem("autentication","yes");
                }
            });
            // Si las credenciales no son correctas, mostrar una alerta
            if (!credencialesCorrectas) { 
                alert("Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.");
            }
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error en la solicitud:', error);
            alert("Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
        });
}
