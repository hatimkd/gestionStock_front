import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Article {
  id: number;
  name: string;
  reference: string;
  category: number | null;
  unit_price: string;
  quantity: number;
  critical_threshold: number;
  created_at: string;
  is_critical: boolean;
  image: string;
}

interface ArticleState {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  totalCount:number;
  error: string | null;
  selectedArticle: Article | null;
}



const initialState: ArticleState = {
  articles: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,


  totalCount: 0,
  error: null,
  selectedArticle: null,

  // isAuthenticated: !!accessToken,  // true si accessToken existe

};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    // setArticles: (state, action: PayloadAction<Article[]>) => {
    //   state.articles = action.payload;
    // },
    setArticles: (state, action: PayloadAction<{ results: Article[]; count: number }>) => {
      state.articles = action.payload.results;
      state.totalCount = action.payload.count;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
      // console.log(state);

    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedArticle: (state, action: PayloadAction<Article | null>) => {
      state.selectedArticle = action.payload;
    },
  },
});

export const {
  setArticles,
  setCurrentPage,
  setTotalPages,
  setLoading,
  setError,
  setSelectedArticle,
} = articleSlice.actions;

export const selectAllArticles = (state: RootState) => state.articles.articles;
export const selectCurrentPage = (state: RootState) => state.articles.currentPage;
export const selectTotalPages = (state: RootState) => state.articles.totalPages;
export const selectIsLoading = (state: RootState) => state.articles.isLoading;
export const selectError = (state: RootState) => state.articles.error;
export const selectSelectedArticle = (state: RootState) => state.articles.selectedArticle;

export default articleSlice.reducer;