const form = document.getElementById('registerForm')

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/users/user', {
        method: "POST",
        body:JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json",
        },
    }) .then((response) => {
        console.log(response.status)
        if (response.status === 201) {

            window.location.href = "/api/views/login";
        }
    })
})

