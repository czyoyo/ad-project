import { Category } from '../types/shop.types.ts';
import axios from 'axios';

class CategoryService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_KEY || 'http://your-api-url';
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(`${this.apiUrl}/categories`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '카테고리를 불러오는데 실패했습니다.');
      }
      throw new Error('카테고리를 불러오는데 실패했습니다.');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await axios.get<Category>(`${this.apiUrl}/categories/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || '카테고리 정보를 불러오는데 실패했습니다.',
        );
      }
      throw new Error('카테고리 정보를 불러오는데 실패했습니다.');
    }
  }
}

export default new CategoryService();
