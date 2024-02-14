import { productManager } from './ProductManager.js';
import express from 'express'

const app = express();

//Configuración
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(8080,()=>{
    console.log("Escuchando puerto 8080")
})

//Endpoints 

//endpoint /products
app.get('/products', async (req,res)=>{

    try {
        const {limit} = req.query;

       const productos = await productManager.getProducts(limit);
       
       if(!limit) {
        console.log(productos);
        res.status(200).json({message: productos});

       } else {
        // Limita la cantidad de productos según el límite proporcionado
           const limiteProductosArreglo = productos.slice(0,limit);
           console.log(limiteProductosArreglo)
           res.status(200).json({message: limiteProductosArreglo});
           res.send('productos',limiteProductosArreglo)
       }
       
    } catch (error) {
       return error;
    }
})

//endpoint /products/:pid
app.get('/products/:idProduct', async(req,res)=>{

    try {
        
        const productos = await productManager.getProducts();
        const {idProduct} = req.params;
        const product = productos.find(p=>p.id ===+idProduct)
        console.log(product)
        res.status(200).json({message: 'Producto: ',product})
    } catch (error) {
        return error;
    }

})
