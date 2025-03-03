import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop, ShopFilter } from '../../types/shop.types.ts';

// 비동기 액션 생성
export const fetchShops = createAsyncThunk(
  'shop/fetchShops',
  async (filters: ShopFilter, { rejectWithValue }) => {
    try {
      const shopService = new ShopService();
      return await shopService.getShops(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      );
    }
  },
);

export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const shopService = new ShopService();
      return await shopService.getShopById(shopId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      );
    }
  },
);

export const addFavoriteShop = createAsyncThunk(
  'shop/addFavorite',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const shopService = new ShopService();
      await shopService.addFavorite(shopId);
      return shopId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      );
    }
  },
);

export const removeFavoriteShop = createAsyncThunk(
  'shop/removeFavorite',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const shopService = new ShopService();
      await shopService.removeFavorite(shopId);
      return shopId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      );
    }
  },
);

interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  favorites: string[]; // 즐겨찾기 목록 (Shop ID 배열)
  filteredShops: Shop[];
  isLoading: boolean;
  error: string | null;
  filters: ShopFilter;
}

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  favorites: [],
  filteredShops: [],
  isLoading: false,
  error: null,
  filters: {
    category: '',
    location: '',
    rating: 0,
    search: '',
  },
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<ShopFilter>>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    setFavorites(state, action: PayloadAction<string[]>) {
      state.favorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchShops
    builder
      .addCase(fetchShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload;
        state.filteredShops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchShopById
    builder
      .addCase(fetchShopById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShop = action.payload;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // addFavoriteShop
    builder
      .addCase(addFavoriteShop.fulfilled, (state, action) => {
        if (!state.favorites.includes(action.payload)) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(addFavoriteShop.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // removeFavoriteShop
    builder
      .addCase(removeFavoriteShop.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter((id) => id !== action.payload);
      })
      .addCase(removeFavoriteShop.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setFavorites } = shopSlice.actions;
export default shopSlice.reducer;
