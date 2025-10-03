import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectProducts, selectCart, selectUser, selectLoading , selectError,  selectCartCount, selectTotalPrice } from './store/store' /*Добавила import */
import { setProducts, addToCart, removeFromCart, updateQuantity, setUser, setLoading, setError, clearCart  } from './store/store' /*Добавила import */

import './App.css'

function App() {
  return (
      <div className="app">
        <Header />
        <div className="main-content">
          <ProductList />
          <Cart />
        </div>
      </div>
  )
}

function ProductList() {
  const dispatch = useDispatch()
  /* Добавление селекторов */
  const products = useSelector(selectProducts)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(setLoading(true))
    const t = setTimeout(() => {
      try {
      const mockProducts = [
        { id: 1, name: 'iPhone 14', price: 799, category: 'phones', image: 'https://via.placeholder.com/200', description: 'Новейший iPhone' },
        { id: 2, name: 'Samsung Galaxy S23', price: 699, category: 'phones', image: 'https://via.placeholder.com/200', description: 'Флагман Samsung' },
        { id: 3, name: 'MacBook Pro', price: 1999, category: 'laptops', image: 'https://via.placeholder.com/200', description: 'Мощный ноутбук Apple' },
        { id: 4, name: 'Dell XPS 13', price: 1299, category: 'laptops', image: 'https://via.placeholder.com/200', description: 'Премиум ноутбук Dell' },
        { id: 5, name: 'iPad Air', price: 599, category: 'tablets', image: 'https://via.placeholder.com/200', description: 'Планшет Apple' },
        { id: 6, name: 'Samsung Galaxy Tab', price: 399, category: 'tablets', image: 'https://via.placeholder.com/200', description: 'Планшет Samsung' }
      ]
      dispatch(setProducts(mockProducts))
      dispatch(setError(null))
      } catch (e) {
        dispatch(setError('Не удалось загрузить товары'))
      }  finally {
      dispatch(setLoading(false))
      }
    }, 1000)

    /*Добавила очистку таймера */
    return () => clearTimeout(t)
  }, [dispatch]) 

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'price') return a.price - b.price
    return 0
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  if (error) {
    return <div className='error'>{error}</div>
  }

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>
  }

  return (
    <div className="product-list">
      <div className="filters">
        <div className="search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {/*Добавила  showFilter, чтобы кнопка работала*/}
        <div className="filter-controls">
        {showFilters && (
          <>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">Все категории</option>
            <option value="phones">Телефоны</option>
            <option value="laptops">Ноутбуки</option>
            <option value="tablets">Планшеты</option>
          </select>
          
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">По названию</option>
            <option value="price">По цене</option>
          </select>
          </> )}
          
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
      </div>
      </div>

      <div className="products">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price">${product.price}</div>
            <button 
              onClick={() => dispatch(addToCart(product))}       
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}



function Cart() {

  const dispatch = useDispatch()

  /*Добавила селекторы*/
  const cart = useSelector(selectCart)             
  const cartCount = useSelector(selectCartCount)  
  const totalPrice = useSelector(selectTotalPrice)
 
  const [isOpen, setIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({id, quantity}))
  }

  const handleCheckout = () => {
    setShowCheckout(true)
    setTimeout(() => {
      alert('Заказ оформлен!')
      dispatch(clearCart())
      setShowCheckout(false)
      setIsOpen(false)
    }, 1000)
  }

  return (
    <div className="cart">
      <button 
        className="cart-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Корзина ({cartCount})
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Корзина</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total">Итого: ${totalPrice}</div>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0 || showCheckout}
            >
              {showCheckout ? 'Оформляем...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Header() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setUser({ 
        id: 1, 
        name: 'Дария', 
        email: 'ivan@example.com' 
      }))
    }, 500)
    return () => clearTimeout(t)
  }, [dispatch])

  return (
    <header className="header">
      <h1>🛒 Интернет-магазин</h1>
      <div className="user-info">
        {user ? (
          <span>Привет, {user.name}!</span>
        ) : (
          <span>Загрузка...</span>
        )}
      </div>
    </header>
  )
}

export default App
