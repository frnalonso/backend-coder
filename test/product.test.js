import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { entorno } from '../src/config/config.js'
import Product from '../src/dao/models/product.model.js'




const requester = supertest('http://localhost:8000');

describe('Product Controller', function() {
  this.timeout(5000); // Establece el tiempo de espera a 5 segundos

  before(async () => {
    await mongoose.connect(entorno.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should create a new product', async () => {
    const validCategoryId = '668081ef247dd53037521c3c'; // Reemplaza esto con un ObjectId válido en tu base de datos

    const productData = {
      title: "ProductitoTest",
      description: "Se describe",
      price: 100,
      category: validCategoryId, // Usa un ObjectId aquí
      code: "NP001",
      stock: 10,
      status: true
    };

    const response = await requester.post('/api/products').send(productData);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('product');
  });
});