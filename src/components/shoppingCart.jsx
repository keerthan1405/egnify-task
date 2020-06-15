import React from 'react';
import './shoping.css';
import cartIcon from '../assets/Icons/cart.png';
import productsData from '../assets/productData.json';
import Cart from './cart';

export default class ShoppingCart extends React.Component {
    constructor() {
        super()
        this.state = {
            sizesArr: ['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL'],
            selectedSizeArr: [],
            noCartArray: productsData.productsdata,
            shoppingArray: [],
            cartArray: [],
            showCart: false,
            orderBy: -1,
            subTotal: 0
        }
        this.showCartPage = this.showCartPage.bind(this)
    }

    componentDidMount = () => {
        this.setState({ shoppingArray: productsData.productsdata });
    }

    sortSize = async (size) => {
        if (this.state.selectedSizeArr.indexOf(size) === -1) {
            await this.setState(prevState => ({
                selectedSizeArr: [...prevState.selectedSizeArr, size]
            }))
            this.sortSizeData()
        } else {
            var array = [...this.state.selectedSizeArr]; // make a separate copy of the array
            var index = array.indexOf(size)
            if (index !== -1) {
                array.splice(index, 1);
                await this.setState({ selectedSizeArr: array });
            }
            this.sortSizeData();
        }
    }

    sortSizeData = () => {
        var sortArray = [];
        this.state.noCartArray.map(item => {
            this.state.selectedSizeArr.map(sizes => {
                if (item.availableSizes.indexOf(sizes) > -1 && sortArray.indexOf(item) === -1) {
                    sortArray.push(item);
                }
            })
        })
        this.setState({ shoppingArray: sortArray });
        if (this.state.shoppingArray.length === 0) {
            this.setState({ shoppingArray: this.state.noCartArray });
        }
        this.orderBy(this.state.orderBy);
    }

    orderByPrice = (e) => {
        this.setState({ orderBy: e.target.value })
        this.orderBy(e.target.value)
    }

    orderBy = (order) => {
        console.log(typeof order, typeof 1, 'sfdgzdfhd', 'order1234')
        if (parseInt(order) === 0) {
            var sortAscData = this.state.shoppingArray.sort((a, b) => {
                return a.price - b.price;
            });
            this.setState({ shoppingArray: sortAscData })
        } else if (parseInt(order) === 1) {
            var sortDescData = this.state.shoppingArray.sort((a, b) => {
                return b.price - a.price;
            });
            this.setState({ shoppingArray: sortDescData })
        }
    }

    showCartPage = () => {
        this.setState(prevState => ({
            showCart: !prevState.showCart
        }))
    }

    closeCart = () => {
        if (this.state.showCart) {
            this.setState({ showCart: false });
        }
    }

    addCart = async (product) => {
        product.quantity = 1;
        await this.setState(prevState => ({
            cartArray: [...prevState.cartArray, product]
        }));
        var shoppingArray = this.state.shoppingArray;
        var newArr = shoppingArray.filter(el => el.id !== product.id);
        this.setState({ shoppingArray: newArr });
        var noCartArray = this.state.noCartArray;
        var noCartArr = noCartArray.filter(el => el.id !== product.id);
        this.setState({ noCartArray: noCartArr });
        this.calculateSubTotal();
    }

    removeItemFromCart = async (cart) => {
        delete cart.quantity;
        var cartArray = this.state.cartArray;
        var newArr = cartArray.filter(el => el.id !== cart.id);
        this.setState({ cartArray: newArr });
        await this.setState(prevState => ({
            shoppingArray: [...prevState.shoppingArray, cart]
        }))
        await this.setState(prevState => ({
            noCartArray: [...prevState.noCartArray, cart]
        }))
        this.orderBy(this.state.orderBy);
        this.calculateSubTotal();
    }

    addQuantity = (cartItem) => {
        var cartItems = this.state.cartArray;
        cartItems.map(cartData => {
            if (cartData.id === cartItem.id) {
                cartItem.quantity = cartItem.quantity + 1;
            }
        });
        this.setState({ cartArray: cartItems });
        this.calculateSubTotal();
    }

    decreaseQuantity = (cartItem) => {
        var cartItems = this.state.cartArray;
        // console.log(cartData.quantity, 'jhdvjhdvhsdfh')
        // debugger;
        cartItems.map(cartData => {
            if (cartData.id === cartItem.id && cartData.quantity !== 1) {
                cartItem.quantity = cartItem.quantity - 1;
                this.setState({ cartArray: cartItems });
                this.calculateSubTotal();
            } else if (cartItem.quantity === 1) {
                delete cartItem.quantity;
                this.removeItemFromCart(cartItem);
            }
        });
    }

    calculateSubTotal = () => {
        var total = 0;
        this.state.cartArray.map(cartItem => {
            total += cartItem.quantity * cartItem.price
        });
        this.setState({ subTotal: total });
    }

    render() {
        return (
            <div className="main--shop--block">
                <div className={'cart--block ' + (!this.state.showCart ? '' : 'dnone')} onClick={this.showCartPage}>
                    <div >
                        <img src={cartIcon} alt="cart icon"></img>
                        <span>{this.state.cartArray.length}</span>
                    </div>
                </div>
                <Cart {...this.state} showCartPage={this.showCartPage} removeItemFromCart={this.removeItemFromCart} addQuantity={this.addQuantity} decreaseQuantity={this.decreaseQuantity} />
                <div className="container" onClick={this.closeCart}>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="sizes--block">
                                <h2>Sizes:</h2>
                                <div className="row">
                                    {this.state.sizesArr.map((item, index) =>
                                        <div className="col-md-3" key={index} onClick={() => this.sortSize(item)}>
                                            <div className={"size " + (this.state.selectedSizeArr.indexOf(item) > -1 ? 'active' : '')}>
                                                <span>{item}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div className="pro--content">
                                <div className="c--header">
                                    <h3>{this.state.shoppingArray.length} Products</h3>
                                </div>
                                <div className="order--by">
                                    <label>Order By</label>
                                    <select onChange={this.orderByPrice} defaultValue={-1}>
                                        <option disabled value={-1}>Select</option>
                                        <option value={0}>Price low to high</option>
                                        <option value={1}>Price high to low</option>
                                    </select>
                                </div>
                            </div>
                            {/* Products Block */}
                            <div className="produt--block">
                                <div className="row">
                                    {this.state.shoppingArray.map(product =>
                                        <div className="col-md-3" key={product.id}>
                                            <div className={'ship--txt ' + (product.isFreeShipping ? 'freeShippingBkClr' : '')}>
                                                {product.isFreeShipping && <p>Free shipping</p>}
                                            </div>
                                            <div className="pro--img--block">
                                                <img src={require(`../assets${product.src_1}`)} alt="product icon"></img>
                                            </div>
                                            <div className="pro--txt">
                                                <p>{product.title}</p>
                                            </div>
                                            <div className="border--r"><hr></hr></div>
                                            <div className="mrp--block">
                                                <p><span>&#36;</span> {product.price}</p>
                                            </div>
                                            <div className="btn--block">
                                                <button type="button" onClick={() => this.addCart(product)}>Add to cart</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}