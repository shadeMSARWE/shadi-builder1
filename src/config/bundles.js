/**
 * باقات النقاط للشراء عبر PayPal
 * السعر بالدولار الأمريكي
 */
module.exports.BUNDLES = [
  { id: "credits_500", name: "500 نقطة", credits: 500, price: "4.99", currency: "USD" },
  { id: "credits_1500", name: "1,500 نقطة", credits: 1500, price: "12.99", currency: "USD" },
  { id: "credits_5000", name: "5,000 نقطة", credits: 5000, price: "34.99", currency: "USD" },
  { id: "credits_15000", name: "15,000 نقطة", credits: 15000, price: "89.99", currency: "USD" }
];

function getBundle(bundleId) {
  return module.exports.BUNDLES.find((b) => b.id === bundleId) || null;
}

module.exports.getBundle = getBundle;
