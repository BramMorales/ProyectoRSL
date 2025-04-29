document.getElementById("Buscador").addEventListener("submit", async (e)=>{
  e.preventDefault();

  const data = new FormData(e.target);
  const payload = {
    que: data.get("que"),
    donde: data.get("donde"),
  }

  window.location.href = `/Busqueda?search_query=${payload.que}&location=${payload.donde}`;
})