document.getElementById("logout").addEventListener("click", ()=>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.location.href = "/Inicio"
})