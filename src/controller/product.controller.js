import ProductManagerDB from '../DAL/dao/productManagerMongo.js';
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

export const dbM = new ProductManagerDB()

// Importar todos los routers;

export const getProducts = async (req, res) => {

    try {
        const { limit, page, sort } = req.query
        let filterQuery = { ...req.query }
        if (limit) delete filterQuery.limit
        if (page) delete filterQuery.page
        if (sort) delete filterQuery.sort

        let arrProduct = await dbM.getProducts(limit, page, sort, filterQuery)
        return res.status(200).json({
            status: "success",
            ...arrProduct
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", error: e.message })
    }
}

// Endpoint para traer el producto solicitado by id en el params
export const getOneProductById = async (req, res) => {
    const { pid } = req.params
    if (!pid) return res.status(400).json({ status: "error", error: "Debe enviar un id de producto por params" })
    try {
        let payload = await dbM.getProductById(pid)
        return res.status(200).json({ status: "success", payload, })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", error: e.message })
    }
}


export const createProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const product = { title, description, code, price, status, stock, category, thumbnail }
    try {
        // Verificar si los campos obligatorios están presentes
        if (!title || !description || !code || !price || !stock || !category) {
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
        }

        // Crear el objeto del producto
        const obj = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };

        // Agregar el producto a la base de datos
        const arrProduct = await dbM.addProduct(obj);

        return res.status(200).json({ result: arrProduct });
    } catch (error) {
        // Manejo de errores
        console.error(error);

        // Enviar una respuesta de error al cliente
        return res.status(500).json({ error: error.message || 'Error al crear el producto' });
    }
};

export const productUpdater = async (req, res) => {
    const { pid } = req.params
    let objeChanges = { ...req.body }
    delete objeChanges.id;
    const keysArr = Object.keys(objeChanges)

    if (pid && keysArr.length > 0) {
        try {

            if (objeChanges.title) objeChanges.title = objeChanges.title.toString()
            if (objeChanges.description) objeChanges.description = objeChanges.description.toString()
            if (objeChanges.code) objeChanges.code = objeChanges.code.toString()
            if (objeChanges.price) objeChanges.price = parseFloat(objeChanges.price)
            if (objeChanges.status) objeChanges.status = Boolean(objeChanges.status)
            if (objeChanges.stock) objeChanges.stock = parseInt(objeChanges.stock)
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.thumbnail) objeChanges.thumbnail = objeChanges.thumbnail.toString();

                    
                
            


            let arrProduct = await dbM.updateProduct(pid, objeChanges)
            return res.status(200).json({ result: arrProduct })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: e.message })
        }
    } else return res.status(400).json({ error: "Debe enviar un id de producto por params y los campos a modificar por body" })

}

export const productDeleter = async (req, res) => {
    const { pid } = req.params

    if (!pid) return res.status(400).json({ error: "Debe enviar un id de producto por params" })
    try {
        await dbM.deleteProduct(pid)
        return res.status(200).json({ result: "Producto borrado" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message })
    }


}

export const productIdFinderDBM = dbM.getProductById