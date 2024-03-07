import fs from 'fs'


class CartManager {
    constructor(path) {
        this.path = path
    }

    async createCart() {
        try {

            const carts = await this.getCarts();
            let id;
            let products;

            if (!carts.length) {
                id = 1;
                products = [];
            } else {
                id = carts[carts.length -1].id +1;
                products = []
            }

            const cart = ({id, products})

            carts.push(cart);

            await fs.promises.writeFile(this.path,JSON.stringify(carts))
            return cart;

        } catch (error) {
            return error;
        }
    }


    async getCartById(idCart) {

        try {
            const carts = await this.getCarts();
            const cartId = carts.find(c=>c.id === +idCart)
            return cartId;
            
        } catch (error) {
            return error
        }
    }


    async insertProductInCart(idCart, idProduct) {

        try {

            const carts = await this.getCarts();

            
            //Busco en que posicion se encuentra el carrito segun el id recibido.
            const indexCart = carts.findIndex((c) => c.id === +idCart);
            console.log(`Indice del carrito: ${indexCart}`)

            if (indexCart === -1) {
                console.log("El carrito no se encontró");
                return -1;
            }

            //Creo un nuevo arreglo accediendo al arreglo de los productos del carrito de la posicion encontrada
            const arrayProductsCart = carts[indexCart].products

            console.log(arrayProductsCart)
            //Busco en que posicion se encuentra el producto segun el id recibido.
            const indexProductInCart = arrayProductsCart.findIndex(p => p.productId ===+idProduct);

            //Logica para verificar que el producto no exista en el carrito y así agregar un nuevo producto y cantidad al arreglo de productos del carrito.
            if (indexProductInCart === -1){
               
                console.log("El producto no se encuentra en el carrito, será agregado al carrito con una cantidad de valor 1.")
                let quantity  = 1;
                const productNewInCart = ({productId:+idProduct, quantity})
                console.log(productNewInCart)
                arrayProductsCart.push(productNewInCart);
                await fs.promises.writeFile(this.path,JSON.stringify(carts))
                return `Se ha agregado el producto al carrito.`

            } 
            
            //Logica para verificar que el producto exista en el carrito y así sumar el elemnto quantity al producto encontrado en el carrito.
            if (indexProductInCart !== -1) {

                const productId = arrayProductsCart[indexProductInCart].productId
                console.log(`El producto se encuentra y es el id: ${productId}`)
                arrayProductsCart[indexProductInCart].quantity+=1 

                await fs.promises.writeFile(this.path,JSON.stringify(carts))
                return `Se le ha incrementado una cantidad al producto id:${productId}`;

            }
   
        } catch (error) {
            return error;
        }
    }


    async getCarts() {
        try {
            if (fs.existsSync(this.path)){
                const carts = await fs.promises.readFile(this.path,'utf-8')
                return JSON.parse(carts);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

}

export const cartManager = new CartManager('Carts.json');