export const Errors =  Object.freeze({
    USER_NOT_FOUND: 'User with this username not found',
    USERNAME_ALREADY_EXISTS: 'User with this username already exists',
    USER_UPDATE_FIELDS_REQUIRED: 'User update fields are required',

    SELLER_NOT_FOUND: 'Seller with this id not found',
    SELLER_NOT_FOUND_USERNAME: 'Seller with this username not found',

    WALLET_NOT_FOUND: 'Wallet with username not found',
    INSUFFICIENT_WALLET_BALANCE: 'Insufficient balance in your wallet',

    PRODUCT_NOT_FOUND: 'Product with this id not found',
    PRODUCT_NOT_FOUND_CATEGORY: 'Product not found',
    PRODUCT_NOT_FOUND_SELLERS_ID: 'Product for this seller not found',
    PRODUCT_UPDATE_FIELDS_REQUIRED: 'Product update fields are required',
    PRODUCT_QUANTITY_NOT_AVAILABLE: 'This much quantity of the product is not available',

    CATEGORY_NOT_FOUND: 'Category with this name not found',
    CATEGORY_UPDATE_FIELDS_REQUIRED: 'Category update fields are required',
    CATEGORY_ALREADY_EXISTS: 'Category with this name already exists',

    ORDER_NOT_FOUND: 'Order with this id not found',

    PAYMENT_NOT_FOUND: 'Payment with this id not found',
    
    INTERNAL_ERROR: 'Internal server error',
    AUTHORIZATION_FAILED: 'Authorization failed',
    INCORRECT_PASSWORD: 'Incorrect password'
})