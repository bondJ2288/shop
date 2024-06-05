import axios from 'axios';

const alt = () => {
    const addToCartButton = document.querySelector('.add-to-cart-button2');
    const closeModalButton = document.querySelector('.close-product-modal');
    const productModal = document.querySelector('.product-modal');
    const sizeElements = document.querySelectorAll('.product-sizes .size');
    const cartModal = document.getElementById('cartModal');
    const but = document.getElementById('openModalBtn2');
    const closeCartModalButton = document.querySelector('.close-cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderButton = document.querySelector('.checkout');

    if (!addToCartButton || !closeModalButton || !productModal || !cartModal || !but || !closeCartModalButton || !cartItemsContainer || !totalPriceElement || !placeOrderButton) {
        console.error('One or more required elements not found');
        return;
    }

    let selectedSize = null;
    let jwtToken = localStorage.getItem('jwt');
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (!jwtToken || !userData || !userData.cart || !userData.cart.id) {
        console.error('User data or JWT token not found');
        return;
    }

    sizeElements.forEach(sizeElement => {
        sizeElement.addEventListener('click', () => {
            sizeElements.forEach(el => el.classList.remove('selected'));
            sizeElement.classList.add('selected');
            selectedSize = sizeElement.textContent;
        });
    });

    closeModalButton.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    addToCartButton.addEventListener('click', () => {
        if (!selectedSize) {
            alert('Пожалуйста, выберите размер');
            return;
        }

        const productName = addToCartButton.getAttribute('data-name');
        if (!productName) {
            alert('Не удалось определить товар');
            return;
        }

        getCartData(userData.cart.id, jwtToken)
            .then(cartData => {
                addProductToProds(userData.cart.id, jwtToken, productName);
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
            });
    });

    closeCartModalButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    placeOrderButton.addEventListener('click', () => {
        createOrder(userData.cart.id, jwtToken);
    });

    const getCartData = (cartId, token) => {
        return axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}?populate=*`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            return response.data.data;
        });
    };

    const addProductToProds = (cartId, token, productName) => {
        let data = {
            name: productName,
            size: selectedSize,
            count: 1
        };

        axios.post('https://better-success-f3e3e81dd8.strapiapp.com/api/prods', { data }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            let prodId = response.data.data.id;

            axios.put(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}`, {
                data: {
                    prods: {
                        connect: [{ id: prodId }]
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                alert('Товар добавлен в корзину');
                productModal.style.display = 'none';
                displayCartItems();
            }).catch(error => {
                console.error('Error updating cart with prod:', error);
            });
        }).catch(error => {
            console.error('Error adding product to prods:', error);
        });
    };

    const createOrder = (cartId, token) => {
        getCartData(cartId, token).then(cartData => {
            if (cartData && cartData.attributes && cartData.attributes.prods) {
                const prodsData = cartData.attributes.prods.data || [];
                let orderData = {
                    prods: { connect: prodsData.map(prod => ({ id: prod.id })) }
                };

                const productNames = prodsData.map(prod => prod.attributes.name).join(', ');
                orderData.name = productNames;

                axios.post('https://better-success-f3e3e81dd8.strapiapp.com/api/orders', { data: orderData }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                    const orderId = response.data.data.id;
                    addOrderToCart(cartId, token, orderId)
                        .then(() => {
                            clearCart(cartId, token);
                            alert('Заказ успешно оформлен');
                        })
                        .catch(error => {
                            console.error('Error adding order to cart:', error);
                        });
                }).catch(error => {
                    console.error('Error creating order:', error);
                });
            } else {
                console.error('No products found in cart');
            }
        }).catch(error => {
            console.error('Error fetching cart data:', error);
        });
    };

    const addOrderToCart = (cartId, token, orderId) => {
        return axios.put(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}`, {
            data: {
                orders: {
                    connect: [{ id: orderId }]
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    };

    const clearCart = (cartId, token) => {
        console.log('Clearing cart...');
        return new Promise((resolve, reject) => {
            getCartData(cartId, token).then(cartData => {
                if (cartData && cartData.attributes && cartData.attributes.prods) {
                    const prodIds = cartData.attributes.prods.data.map(prod => prod.id);

                    const disconnectProdsPromises = prodIds.map(prodId => {
                        return axios.delete(`https://better-success-f3e3e81dd8.strapiapp.com/api/prods/${prodId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        });
                    });

                    Promise.all(disconnectProdsPromises).then(() => {
                        displayCartItems();
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    console.error('No products found in cart');
                    reject(new Error('No products found in cart'));
                }
            }).catch(error => {
                console.error('Error fetching cart data:', error);
                reject(error);
            });
        });
    };

    const displayCartItems = () => {
        cartItemsContainer.innerHTML = '';

        getCartData(userData.cart.id, jwtToken)
            .then(cartData => {
                if (cartData && cartData.attributes && cartData.attributes.prods) {
                    const prodsData = cartData.attributes.prods.data || [];
                    let totalPrice = 0;

                    const uniqueProductNames = new Set();
                    const productPromises = prodsData.map(item => {
                        if (item && item.attributes) {
                            const productAttributes = item.attributes;
                            if (uniqueProductNames.has(productAttributes.name)) {
                                return Promise.resolve(null);
                            }
                            uniqueProductNames.add(productAttributes.name);

                            return axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*`)
                                .then(response => {
                                    const products = response.data.data;
                                    const product = products.find(product => product.attributes.name === productAttributes.name);

                                    if (product) {
                                        const imageURL = product.attributes.preview.data.attributes.url;
                                        const fullImageURL = `https://better-success-f3e3e81dd8.strapiapp.com${imageURL}`;
                                        const price = parseFloat(product.attributes.price); // Преобразование строки в число
                                        totalPrice += price;

                                        const itemElement = document.createElement('div');
                                        itemElement.classList.add('cart-item');

                                        itemElement.innerHTML = `
                                            <img src="${fullImageURL || 'https://via.placeholder.com/100'}" alt="${productAttributes.name || 'Product Image'}" class="product-image">
                                            <div class="product-details">
                                                <h3 class="product-name">${productAttributes.name || 'Название товара'}</h3>
                                                <p class="product-size">Размер: ${productAttributes.size || 'N/A'}</p>
                                                <p class="product-price">Цена: ${price || 'N/A'}₽</p>
                                            </div>
                                        `;

                                        cartItemsContainer.appendChild(itemElement);

                                        return productAttributes.name;
                                    } else {
                                        console.error('Product not found:', productAttributes.name);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching product details:', error);
                                });
                        } else {
                            console.error('Invalid product data:', item);
                        }
                    });

                    Promise.all(productPromises).then(() => {
                        totalPriceElement.textContent = `Примерная цена: ${totalPrice}₽`;
                    });

                    but.addEventListener('click', () => {
                        cartModal.style.display = 'block';
                    });
                } else {
                    console.error('No product data found in cart:', cartData);
                }
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
            });
    };

    if (cartModal.style.display !== 'block') {
        displayCartItems();
    }

    document.addEventListener('DOMContentLoaded', () => {
        getCartData(userData.cart.id, jwtToken)
            .then(cartData => {
                console.log('Cart data fetched successfully');
                displayCartItems();
            })
            .catch(error => {
                console.error('Error fetching current cart data:', error);
            });
    });
};

export default alt;
