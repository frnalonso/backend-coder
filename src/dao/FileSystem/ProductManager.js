import fs from 'fs';

export default class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async addProduct(obj) {


        try {
            const products = await this.getProducts();
            const product = obj
            let id;

            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            const foundProduct = products.some((p) => p.code === product.code)
            
            console.log(foundProduct)

            if (foundProduct) {
                console.log(`No se puede añadir. Ya existe un producto con el código ${product.code}`)
                return 
            } 
            console.log(`El producto con el código ${product.code} se añadió correctamente.`)
            products.push({ id, ...obj });
            
            
            await fs.promises.writeFile(this.path, JSON.stringify(products));

            return obj;


        } catch (error) {
            return error;
        }

    }


    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(products);
            } else {
                return [];
            }
        } catch (error) {
            return error
        }
    }

    async updateProduct(idProduct, obj) {
        try {
            const products = await this.getProducts()
            const index = products.findIndex(p => p.id === idProduct)

            //si no se encuentra coincidencia findIndex devuelve -1, en caso que sea distinto ingresa al if
            if (index !== -1) {
                //verifica que el id del objeto on se modifique.
                if (obj.id && obj.id !== idProduct) {
                    return 'El id del objeto no se puede modificar.';
                }
                //actualiza propiedades del producto existente

                products[index] = { ...products[index], ...obj }
                await fs.promises.writeFile(this.path, JSON.stringify(products));

            } else {
                return 'Producto no encontrado'
            }

        } catch (error) {
            return error
        }
    }

    async deleteProduct(productById) {

        try {
       
            const products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== productById)
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
        } catch (error) {
            return error;
        }

    }

    async getProductById(idProduct) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === idProduct)
            if (product) {
                return product
            } else {
                return 'Producto no existe'
            }
        } catch (error) {
            return error
        }
    }



}


//export const productManager = new ProductManager('Products.json');

