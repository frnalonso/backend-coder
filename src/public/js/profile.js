fetch('/api/current', {
    method: "get",
    headers:{
        "authorization": `Bearer ${localStorage.getItem('token')}`    
    }
}).then(response => {
    if(response.status === 401) {
        window.location.replace('/api/views/session/login')
    } else {
        return response.json()
    }
}).then(json =>{
    const parrafo = document.querySelector('#result')
    parrafo.innerHTML = `Hola tus datos son ${json.payload.email} y ${json.payload.password}`
})