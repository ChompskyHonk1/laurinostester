"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

// Cart notification styles
export const CartNotification = styled.div`
  display: ${props => props.$visible ? 'block' : 'none'};
  position: fixed;
  top: 100px; /* Distance from top - adjust based on your header height */
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.$visible ? '0' : '-100%'});
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  opacity: ${props => props.$visible ? '1' : '0'};
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  .notification-content {
    display: flex;
    align-items: center;
    
    .check-icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }
    
    .message {
      font-weight: 500;
    }
  }
`;
// Cart modal styles
export const CartModal = styled.div`
  display: ${props => props.$visible ? 'block' : 'none'};
  position: fixed;
  top: 7;
  right: 0;
  width: 500px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.light};
  border-left: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  transform: translateX(${props => props.$visible ? '0' : '100%'});
  transition: transform 0.3s ease;
  overflow-y: auto;
  padding: 2rem;
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h2 {
      font-family: 'Aloja', serif;
      font-size: 1.8rem;
      margin: 0;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: ${({ theme }) => theme.colors.primaryDark};
      
      &:hover {
        color: ${({ theme }) => theme.colors.secondaryDark};
      }
    }
  }
  
  .cart-items {
    margin-bottom: 2rem;
  }
  
  .cart-item {
    display: flex;
    padding: 1rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
    
    .cart-item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 1rem;
    }
    
    .cart-item-details {
      flex: 1;
      
      .cart-item-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .cart-item-meta {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.colors.secondaryDark};
        margin-bottom: 0.25rem;
      }
      
      .cart-item-price {
        font-weight: 600;
      }
    }
    
    .cart-item-actions {
      display: flex;
      align-items: center;
      
      .quantity-control {
        display: flex;
        align-items: center;
        margin-right: 1rem;
        
        button {
          width: 24px;
          height: 24px;
          background: ${({ theme }) => theme.colors.light};
          border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          
          &:hover {
            background: ${({ theme }) => theme.colors.tertiaryDark};
          }
        }
        
        span {
          width: 30px;
          text-align: center;
        }
      }
      
      .remove-button {
        color: red;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        
        &:hover {
          color: darkred;
        }
      }
    }
  }
  
  .cart-footer {
    .cart-total {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      padding-top: 1rem;
      border-top: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
    }
    
    .checkout-button {
      width: 100%;
      padding: 1rem;
      background: ${({ theme }) => theme.colors.primaryDark};
      color: ${({ theme }) => theme.colors.primaryLight};
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.3s ease;
      
      &:hover {
        background: ${({ theme }) => theme.colors.secondaryDark};
      }
      
      &:disabled {
        background: ${({ theme }) => theme.colors.tertiaryDark};
        cursor: not-allowed;
      }
    }
  }
`;

const CartContext = createContext();

export function CartProvider({ children }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const [cartVisible, setCartVisible] = useState(false);
  const [shippingOption, setShippingOption] = useState(null);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      
      // Calculate totals
      const itemCount = items.reduce((count, item) => count + item.quantity, 0);
      setTotalItems(itemCount);
      
      // Calculate total amount - handle price as string "$25" or as number
      const amount = items.reduce((sum, item) => {
        const price = typeof item.price === 'string' 
          ? Number.parseFloat(item.price.replace('$', '')) 
          : item.price;
        return sum + (price * item.quantity);
      }, 0);
      setTotalAmount(amount);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = (product) => {
    // Ensure product has numeric price
    const productWithNumericPrice = {
      ...product,
      price: typeof product.price === 'string' 
        ? Number.parseFloat(product.price.replace('$', '')) 
        : product.price
    };
    
    setItems(prevItems => {
      // Check if the item with the same id, size and color already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.id === productWithNumericPrice.id && 
               item.size === productWithNumericPrice.size && 
               item.color === productWithNumericPrice.color
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        // Item doesn't exist, add new item with quantity 1
        updatedItems = [...prevItems, { ...productWithNumericPrice, quantity: 1 }];
      }
      
      // Show notification
      showNotification(`${productWithNumericPrice.name} added to cart`);
      
      return updatedItems;
    });
  };

  const removeFromCart = (productId, size, color) => {
    setItems(prevItems => 
      prevItems.filter(item => !(
        item.id === productId && 
        item.size === size && 
        item.color === color
      ))
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    setItems(prevItems =>
      prevItems.map(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Make clearCart a useCallback with fixed flags logic to ensure proper behavior
  const clearCart = useCallback(() => {
    console.log('Clearing cart...');
    
    // Get current page and flags
    const currentPath = window.location.pathname;
    const isInConfirmation = currentPath.includes('order-confirmation');
    const isCompletingCheckout = sessionStorage.getItem('completingCheckout') === 'true';
    
    // Check if we're in the checkout completion flow
    const isInCheckoutFlow = isInConfirmation || isCompletingCheckout;
    
    // Clear cart items and shipping
    setItems([]);
    setShippingOption(null);
    
    // Clear cart storage
    localStorage.removeItem('cart');
    console.log('Cart cleared!');
    
    // If we're in the checkout or confirmation process, keep the checkout flags
    if (isInCheckoutFlow) {
      console.log("Clearing cart during checkout completion - maintaining checkout flags");
      // Ensure both flags are set
      sessionStorage.setItem('isCheckingOut', 'true');
      sessionStorage.setItem('completingCheckout', 'true');
    } else {
      console.log("Regular cart clear - removing checkout flags");
      sessionStorage.removeItem('isCheckingOut');
      sessionStorage.removeItem('completingCheckout');
    }
  }, []);
  
  const showNotification = (message) => {
    setNotification({ visible: true, message });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };
  
  const toggleCart = () => {
    setCartVisible(prev => !prev);
  };

  const proceedToCheckout = () => {
    setCartVisible(false);
    // Set checkout flag before navigating
    sessionStorage.setItem('isCheckingOut', 'true');
    router.push('/checkout');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        notification,
        cartVisible,
        toggleCart,
        setCartVisible,
        proceedToCheckout,
        shippingOption,
        setShippingOption,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}