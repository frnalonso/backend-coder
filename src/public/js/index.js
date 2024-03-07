const socket = io();
const formProduct = document.getElementById('form-products')
const deleteProduct = document.getElementById('delete-product')
const table = document.getElementById('table-products')
  
// Obtener los valores de los campos del formulario

const title = document.getElementById('title');
const description = document.getElementById('description');
const price = document.getElementById('price');
const thumbnail = document.getElementById('thumbnail');
const code = document.getElementById('code');
const stock = document.getElementById('stock');
const buttonDelete = document.getElementById('delete-product')
const idProduct = document.getElementById('id-delete')



// Escuchar el evento 'connect'
socket.on('connect', () => {
    console.log(`Conectado con el ID: ${socket.id}`);
});

socket.on('disconnect', () => {
    console.log(`Desconectado con el ID: ${socket.id}`);
});




formProduct.addEventListener('submit',e => {
    e.preventDefault(); //cancelar el comportamiento de reiniciar la pagina x defecto.
    console.log("enviando formulario...")
    console.log(
        title.value,
        description.value,
        price.value
        )
        
        
        socket.emit('client:newproduct',{
        title: title.value,
        description: description.value,
        price: price.value,
        thumbnail: thumbnail.value,
        code: code.value,
        stock: stock.value
    })
})



buttonDelete.addEventListener('click',e =>{
    e.preventDefault();
    const id = idProduct.value;
    console.log("id:"+id)
    socket.emit('client:deleteproduct',id);
})

socket.on('server:deleteproduct', (products) => {
    console.log(products);

    // Actualiza la tabla con los productos actualizados

    table.innerHTML = ''; // Borra la tabla actual

    // Recrea la tabla con los productos actualizados
    products.forEach((product) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
        `;
        table.appendChild(newRow);
    });
});


socket.on('server:newproduct',data => {
    console.log(data.title)
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.id}</td>
        <td>${data.title}</td>
        <td>${data.description}</td>
        <td>${data.price}</td>
        <td>${data.code}</td>
        <td>${data.stock}</td>
    `;
    table.appendChild(newRow);
})
