import categoryService from '../dao/services/category.service.js'

const categoryController = {

    //Obtengo todas las categorias
    getAll: async (req, res) => {
        try {
            const categories = await categoryService.getAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //Busco una categoria por ID
    getById: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await categoryService.getById(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    //Creo una nueva categoría
    createCategory: async (req, res) => {
        try {
            const newCategory = await categoryService.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    //Modifo una categoría según el id
    updateCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const updatedCategory = await categoryService.updateCategory(
                categoryId,
                req.body
            );
            res.json(updatedCategory);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },


    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const result = await categoryService.deleteCategory(categoryId);
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}

export default categoryController;