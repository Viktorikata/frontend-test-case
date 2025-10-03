import { configureStore, createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit';

/* Убрала лишние значения */
const initialState = {
  products: [],
  cart: [],
  user: null,
  loading: false,
  error: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    
    /* Почистила редьюсеры от лишних вычислений */
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.cart.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.push({ ...product, quantity: 1 })
      }
    },
    
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload)
      },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cart.find(item => item.id === id)
      
      if (item) {
        if (quantity > 0 ) {
          item.quantity = quantity
        } else {
          state.cart = state.cart.filter(item=> item.id !== id)
        }}
    },
    
    setUser: (state, action) => {
      state.user = action.payload
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },
    
    clearCart: (state) => {
      state.cart = []
    }
  }
})

/* Убрала лишние селекторы */
export const selectProducts = (state) => state.app.products
export const selectCart = (state) => state.app.cart
export const selectUser = (state) => state.app.user
export const selectLoading = (state) => state.app.loading
export const selectError = (state) => state.app.error

/* Сделала мемо-селекторы */
export const selectCartItemsCount = createSelector(
  [selectCart],
  (cart) => cart.length
)
export const selectCartCount = createSelector(
  [selectCart],
  (cart) => cart.reduce((total, item) => total + item.quantity, 0)
)
export const selectTotalPrice = createSelector(
  [selectCart],
  (cart) => cart.reduce((total, item) => total + item.price * item.quantity, 0)
)

export const { 
  setProducts, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  setUser, 
  setLoading, 
  setError, 
  clearCart 
} = appSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer
  }
})