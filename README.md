# Sage Pay Suite for Hyvä React Checkout

## Prerequisites

1. A working Magento site with [Sage Pay Suite](https://wiki.ebizmarts.com/opayo/m2-installation-guide) module installed and configured.
2. [Hyvä React Checkout](https://github.com/hyva-themes/magento2-react-checkout) is installed and configured.

# How to use it with Hyvä React Checkout?

1. Install [additional module](https://wiki.ebizmarts.com/opayo/additional-module-hyva-reach-checkout) which adds extra GraphQL resources to the Magento.
2. Install our compatibility module for hyvä react checkout, to do this add the below code in your package.json:

    ```
    "config": {
        "paymentMethodsRepo": {
            "sagepaysuitepi": "https://github.com/ebizmarts/magento2-hyva-checkout-sage-pay-suite.git"
        }
    },
    ```
3. Run `npm install` inside react application.
4. Run `NODE_ENV=production npm run build` inside react application.

## More Info
1. https://hyva-themes.github.io/magento2-react-checkout/customize/
2. https://hyva-themes.github.io/magento2-react-checkout/payment-integration/
