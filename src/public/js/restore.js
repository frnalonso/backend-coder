const form = document.getElementById('restoreForm')

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/restore', {
        method: "POST",
        body:JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json",
        },
    }) .then((response) => {
        console.log(response.status)
        if (response.status === 201) {

            console.log("Exitoso el cambio de clave.")
        } else {
            console.log("Algo ha salido inesperado.")
        }
    })
})

