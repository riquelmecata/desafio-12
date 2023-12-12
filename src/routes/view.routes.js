import { Router } from 'express';
import { dbM as dbInstance } from '../controller/product.controller.js';
import { dbM as dbCart } from '../controller/cart.controller.js';
import { adminValidator, userValidator } from "../middlewares/auth.middleware.js"
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';
import loggerMiddleware from '../loggerMiddleware.js';

// Importar todos los routers;
export const router = Router();
router.use(loggerMiddleware);

router.get("/products", userValidator, async (req, res) => {
    if(!req?.user?.email) return res.redirect("/login")
    try {
        req.logger.info('Solicitud para obtener productos');
        const { limit, page, sort } = req.query
        let on = await dbInstance.getProducts(limit, page, sort)
        let productos = JSON.parse(JSON.stringify(on))
        res.render("products", {
            hasNextPage: productos.hasNextPage,
            hasPrevPage: productos.hasPrevPage,
            nextLink: productos.nextLink ? `http://localhost:8080/products?page=${productos.page + 1}&limit=${limit?limit:10}` : null,
            prevLink: productos.prevLink ? `http://localhost:8080/products?page=${productos.page - 1}&limit=${limit?limit:10}` : null,
            productos: productos.payload,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            adminRole: req.user.adminRole,
            age: req.user.age
            
        })
    } catch (e) {
        req.logger.error(`Error al obtener productos: ${e.message}`);
        res.send(500).json({ error: e })
    }
})

router.get("/products/:pid", async (req, res) => {
    if(!req?.user?.email) return res.redirect("/login")
    try {
        req.logger.info('Solicitud para obtener producto');
        const { pid } = req.params
        let on = await dbInstance.getProductById(pid)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(productos)
        res.render("detail", {
            producto: productos
        })
    } catch (e) {
        req.logger.error(`Error al obtener el producto: ${e.message}`);
        res.send(500).json({ error: e })
    }
})

router.get("/carts/:cid", async (req, res) => {
    if(!req?.user?.email) return res.redirect("/login")
    try {
        req.logger.info('Solicitud para obtener carrito');
        const { cid } = req.params
        let on = await dbCart.getCartById(cid)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(productos.products)
        res.render("carts", {
            productos: productos.products
        })
    } catch (e) {
        req.logger.error(`Error al obtener carrito: ${e.message}`);
        res.send(500).json({ error: e })
    }
})

router.get("/login", async (req, res) => {
    if(req?.user?.email) return res.redirect("/products")
    try {
        req.logger.info('Inicio de sesión exitoso');

        res.render("login")
    } catch (e) {
        req.logger.error(`Error al iniciar sesión: ${e.message}`);
        res.send(500).json({ error: e })
    }
})

router.get("/register", async (req, res) => {
    if(req?.user?.email) return res.redirect("/products")

    try {
        req.logger.info('Registro exitoso');
        res.render("register")
    } catch (e) {
        req.logger.error(`Error al registrarse: ${e.message}`);
        res.send(500).json({ error: e })
    }
})


/** esto funciona */
router.get("/profile", adminValidator, async (req, res) => { 
    if(!req?.user?.email)
    {
        req.logger.info('Entrando a profile');
        return res.redirect("/login")
    }
    
    res.render("profile", {
        title: "Vista Profile Admin",
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        adminRole: req.user.adminRole,
        age: req.user.age

    });
})

router.get("/chat", async (req, res) => {

    if (!req?.user?.email) return res.redirect("/login")

    try {
        req.logger.info('Entrando a chat');
        res.render("chat")
    } catch (e) {
        req.logger.error('error entrando a chat');
        res.send(500).json({ error: e.message })
    }
})

//-----------------------------------Mocking--------------------------------//

router.get("/mockingproducts", async(req,res)=>{

    const products = [];

    for (let i = 0; i < 100; i++) {
        const product = {
            id: nanoid(),
            title: faker.commerce.productName(),
            description: `Product ${i + 1}`,
            price: faker.commerce.price(),
            thumbnail: [faker.image.url()],
            code: faker.string.uuid(),
            stock: faker.number.int({ min: 0, max: 100 }),
            status: faker.datatype.boolean(),
            category: faker.commerce.department(),
            availability: faker.helpers.arrayElement(['in_stock', 'out_of_stock']) 
        };

        products.push(product);
    }

    res.send(products);
})
//-------------------------------------Mocking-----------------------------//
