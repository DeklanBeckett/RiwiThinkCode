function registro(){
    // Obtener los valores de los campos de entrada
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const documento = document.getElementById('document');
    const password = document.getElementById('password');

    // Crear un objeto con los datos del nuevo usuario
    const new_user = {
        name: name.value,
        email: email.value,
        document: documento.value,
        password: password.value
    }

    // Verificar si algún campo está vacío
    if (name.value == "" || email.value == "" || documento.value == "" || password.value == "") {
        alert("Faltan datos");
    } else {
        // Enviar una solicitud POST para registrar al nuevo usuario
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_user)
        })
        .then(response => {
            // Mostrar un mensaje de registro exitoso y redirigir a la página  del login
            alert("Se ha registrado un usuario");
            location.href = "file:///C:/Users/juand/OneDrive/Escritorio/riwithinkcodev3/index.html";
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error en la solicitud:', error);
            alert("Hubo un problema al intentar registrar el usuario. Por favor, inténtalo de nuevo más tarde.");
        });
    }
}
