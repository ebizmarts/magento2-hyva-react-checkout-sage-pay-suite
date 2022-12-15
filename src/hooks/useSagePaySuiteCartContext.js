import { useContext } from 'react';
import { get as _get } from 'lodash-es';

import CartContext from '../../../../context/Cart/CartContext';
import { isCartAddressValid } from '../../../../utils/address';

export default function useSagePaySuiteCartContext() {
  const [cartData, { setRestPaymentMethod, setOrderInfo }] =
    useContext(CartContext);
  const cart = _get(cartData, 'cart');
  const cartId = _get(cartData, 'cart.id');
  const cartBillingAddress = _get(cart, `billing_address`, {});
  const selectedShippingMethod = _get(cart, 'selected_shipping_method', {});
  const selectedPaymentMethod = _get(cart, 'selected_payment_method');
  const isVirtualCart = !!_get(cart, 'isVirtualCart');
  const shippingAddress = _get(cart, 'shipping_address');
  const { firstname, lastname, zipcode } = cartBillingAddress;
  const hasCartBillingAddress = firstname && lastname && zipcode;

  return {
    cartId,
    setOrderInfo,
    setRestPaymentMethod,
    hasCartBillingAddress,
    selectedShippingMethod,
    selectedPaymentMethod,
    isVirtualCart,
    doCartContainShippingAddress: isCartAddressValid(shippingAddress),
  };
}
