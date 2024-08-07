const form = document.getElementById('logoutForm')

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/users/logout', {
        method: "POST",
        body:JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json",
        },
    }) .then((response) => {
        console.log(response.status)
        if (response.status === 200) {
            console.log("Cierre de sesión con éxito.")
            window.location.href = '/api/views/login'
        } else {
            console.log("Algo ha salido inesperado.")
        }
    })
})
