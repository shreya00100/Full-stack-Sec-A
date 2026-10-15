import React, { useMemo, useState } from "react";


const DISCOUNT_THRESHOLD = 1000;
const DISCOUNT_RATE = 0.10;

export default function Cart({ products = [] }) {
  const [quantities, setQuantities] = useState({});

  const addProduct = (id) => {
    setQuantities((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
  };

  const decreaseProduct = (id) => {
    setQuantities((current) => {
      const nextQuantity = (current[id] || 0) - 1;
      const next = { ...current };
      if (nextQuantity <= 0) {
        delete next[id];
      } else {
        next[id] = nextQuantity;
      }
      return next;
    });
  };

  const removeProduct = (id) => {
    setQuantities((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const cartItems = useMemo(
    () => products.filter((product) => (quantities[product.id] || 0) > 0),
    [products, quantities]
  );

  const total = cartItems.reduce(
    (sum, product) => sum + Number(product.price) * quantities[product.id],
    0
  );
  const discount = total >= DISCOUNT_THRESHOLD ? total * DISCOUNT_RATE : 0;
  const grandTotal = total - discount;
  const money = (amount) => Number(amount).toFixed(2);

  return (
    <main className="page">
      <section className="cart-card">
        <header className="header">
          <div>
            <p className="eyebrow">SHOP</p>
            <h1>Shopping Cart</h1>
            <p className="subtitle">Add items and quantities to calculate your total.</p>
          </div>
          <span className="cart-count">{cartItems.reduce((sum, item) => sum + quantities[item.id], 0)} items</span>
        </header>

        <section className="product-picker" aria-label="Available products">
          <h2>Products</h2>
          <div className="product-list">
            {products.map((product) => (
              <article className="product" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <p>₹{money(product.price)}</p>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  data-testid={`add-${product.id}`}
                  onClick={() => addProduct(product.id)}
                >
                  Add
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="cart-section" aria-label="Your cart">
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="empty" data-testid="cart-empty">Cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartItems.map((product) => {
                const quantity = quantities[product.id];
                return (
                  <article className="cart-row" key={product.id}>
                    <div className="item-info">
                      <strong>{product.name}</strong>
                      <span>₹{money(product.price)} each</span>
                    </div>
                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name}`}
                        data-testid={`dec-${product.id}`}
                        onClick={() => decreaseProduct(product.id)}
                      >−</button>
                      <span data-testid={`qty-${product.id}`}>{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name}`}
                        data-testid={`inc-${product.id}`}
                        onClick={() => addProduct(product.id)}
                      >+</button>
                    </div>
                    <strong className="line-total">₹{money(Number(product.price) * quantity)}</strong>
                    <button
                      type="button"
                      className="remove-button"
                      data-testid={`remove-${product.id}`}
                      onClick={() => removeProduct(product.id)}
                    >Remove</button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="summary" aria-label="Order summary">
          <div className="summary-line">
            <span>Total</span>
            <strong data-testid="total">Total: {money(total)}</strong>
          </div>
          {discount > 0 && (
            <div className="summary-line discount-line">
              <span>Discount (10%)</span>
              <strong data-testid="discount">Discount: {money(discount)}</strong>
            </div>
          )}
          <div className="summary-line grand-total">
            <span>Grand Total</span>
            <strong data-testid="grand-total">Grand Total: {money(grandTotal)}</strong>
          </div>
          <p className="discount-note">
            {total >= DISCOUNT_THRESHOLD
              ? "10% discount applied."
              : `Spend ₹${money(Math.max(0, DISCOUNT_THRESHOLD - total))} more to unlock 10% off.`}
          </p>
        </section>
      </section>
    </main>
  );
}
