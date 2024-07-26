import categoryRepository from "../repositories/category.repository.js"

 class CategoryService {
  constructor() {
    console.log("Constructor CategoryService");
  }

  getAll = async () => {
    const result = await categoryRepository.getAll();
    return result;
  };

  getById = async (id) => {
    const result = await categoryRepository.getById(id);
    return result;
  };

  createCategory = async (category) => {
    const result = await categoryRepository.createCategory(category)
    return result;
  };

  updateCategory = async (id, categoryData) => {
    const result = await categoryRepository.updateCategory(id, categoryData)
    return result;
  };

  deleteCategory = async (id) => {
    const result = await categoryRepository.deleteCategory(id)
    return result;
  };
}

export default new CategoryService;