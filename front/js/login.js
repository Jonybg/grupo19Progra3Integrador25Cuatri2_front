const button_login = document.getElementById("button_login")
function obtenerUsuario(e){
    e.preventDefault()
    const input_login = document.getElementById("input_nombre").value
    localStorage.setItem("usuario",input_login)
    window.location.href = "index.html";
}

button_login.addEventListener("click",obtenerUsuario)