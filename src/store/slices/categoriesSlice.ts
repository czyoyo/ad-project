import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types/shop.types.ts';

// 비동기 액션 생성
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categoryService = new CategoryService();
      return await categoryService.getCategories();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '카테고리를 불러오는데 실패했습니다.',
      );
    }
  },
);

// 카테고리 상태 타입 정의
interface CategoryState {
  categories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}

// 초기 상태 설정
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

// 카테고리 슬라이스 생성
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
    },

    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 액션 생성자 내보내기
export const { setSelectedCategory, clearSelectedCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
