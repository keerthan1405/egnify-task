import React, { useState, useEffect } from 'react';
import './shoping.css';
import cartIcon from '../assets/Icons/cart.png';

const Cart = (props) => {
    const [showCart, setShowCart] = useState(props.showCart);

    useEffect(() => {
        setShowCart(props.showCart);
    }, [props]);

    function showCartPage() {
        props.showCartPage();
    }

    function removeItemFromCart(cartItem) {
        props.removeItemFromCart(cartItem);
    }

    function addQuantity(cartItem) {
        props.addQuantity(cartItem);
    }

    function decreaseQuantity(cartItem) {
        props.decreaseQuantity(cartItem);
    }

    return (
        <div className={'cart--open ' + (showCart ? 'dblock' : '')}>
            <div className="open--header">
                <div className="close--icon" onClick={showCartPage}>
                    <i className="fas fa-times"></i>
                </div>
                <div className="cart--content">
                    <div className="c--icon">
                        <img src={cartIcon} alt="cart icon"></img>
                        <span>{props.cartArray.length}</span>
                    </div>
                    <div className="item--pro--content">
                        {props.cartArray.map(cart => <div className="item--list">
                            <div className="item--img">
                                <img src={require(`../assets${cart.src_2}`)} alt="product icon"></img>
                            </div>
                            <div className="item--content">
                                <p className="title">{cart.title}</p>
                                <p>Size: {cart.availableSizes[0]}</p>
                                <p>Quantity: {cart.quantity}</p>
                            </div>
                            <div className="item--icons">
                                <span onClick={() => removeItemFromCart(cart)}>
                                    <i className="fas fa-times"></i>
                                </span>
                                <p className="i--q">$ {(cart.quantity * cart.price).toFixed(1)}</p>
                                <div className="count">
                                    <div className="minus" onClick={() => decreaseQuantity(cart)}>-</div>
                                    <div className="plus" onClick={() => addQuantity(cart)}>+</div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    <div className="cart--btns">
                        <div className="cart--p">
                            <p>SUBTOTAL</p>
                            <p className="ib--p">$ {props.subTotal.toFixed(1)}</p>
                        </div>
                        <div className="btn--block">
                            <button type="button">CHECKOUT</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart