import { useContext, useEffect, useState } from "react";
import { contextData } from "../Contex";
import { useFetchData } from "../hooks/useFetchData";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import AddtocartProduct from "../Conponents/AddtocartProduct";
import { useDeleteData } from "../hooks/useDeleteData";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const AddToCart = () => {
  const { userData, setFinalPrice } = useContext(contextData);

  // Load cart from localStorage initially
  const [cartQuantities, setCartQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem("addtocart")) || {};
  });

  // Fetch cart items from API
  const { data, isLoading, error, refetch } = useFetchData(
    "cartItems",
    `/addtocart-list?email=${userData?.email}`
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Update localStorage whenever cartQuantities changes
  useEffect(() => {
    localStorage.setItem("addtocart", JSON.stringify(cartQuantities));
  }, [cartQuantities]);

  const cartItems = Array.isArray(data?.cartItems) ? data.cartItems : [];

  const { mutate: deleteCartItem } = useDeleteData("cartItems");

  // Handler to update quantity from child
  const handleQuantityChange = (id, newQuantity) => {
    setCartQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };

  // Handler to remove item
  const handleDelete = (id) => {
    deleteCartItem(id);
    setCartQuantities((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculate subtotal based on cartQuantities state
  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = cartQuantities[item._id] || 1;
    const price = typeof item.price === "number" ? item.price : Number(item.price) || 0;
    return sum + price * quantity;
  }, 0);

  // Calculate total after discount
  const total = subtotal - discountAmount;

  // Update finalPrice in context only after render, not during render
  useEffect(() => {
    setFinalPrice(total);
  }, [total, setFinalPrice]);

  // Fetch all coupons
  const { data: coupons } = useFetchData(
    "coupons",
    "/coupons"
  );

  // Coupon apply handler
  const handleApplyCoupon = () => {
    setCouponError("");
    setAppliedCoupon(null);
    setDiscountAmount(0);
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (!coupons) {
      setCouponError("Coupons not loaded. Try again later.");
      return;
    }
    const found = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (!found) {
      setCouponError("Coupon not found.");
      toast.error("Coupon not found.");
      return;
    }
    if (found.status !== "active") {
      setCouponError("Coupon is not active.");
      toast.error("Coupon is not active.");
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order for this coupon is $${found.minOrder}`);
      toast.error(`Minimum order for this coupon is $${found.minOrder}`);
      return;
    }
    // Calculate discount
    let discount = 0;
    if (found.type === "fixed") {
      discount = found.discount;
    } else if (found.type === "percent") {
      discount = subtotal * (found.discount / 100);
    }
    setAppliedCoupon(found);
    setDiscountAmount(discount);
    toast.success("Coupon applied!");
  };

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span className="text-[#167389]">Cart</span>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span>Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Your Cart ({cartItems.length})</h2>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <AddtocartProduct
                    item={item}
                    quantity={cartQuantities[item._id] || 1}
                    key={item._id}
                    refetch={refetch}
                    onQuantityChange={handleQuantityChange}
                    onDelete={() => handleDelete(item._id)}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button className="text-[#167389] hover:text-[#135a6e] flex items-center">
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Included</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to='/checkout'  className="block w-[60%] bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium mt-4 ">
                  Proceed to Checkout
                </Link>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Have a Coupon?</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#167389] focus:border-[#167389]"
                  />
                  <button
                    className="bg-[#167389] hover:bg-[#135a6e] text-white px-4 py-2 rounded-r-md"
                    onClick={handleApplyCoupon}
                    type="button"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div className="text-red-500 text-xs mt-1">{couponError}</div>
                )}
                {appliedCoupon && (
                  <div className="text-green-600 text-xs mt-1">
                    Coupon <b>{appliedCoupon.code}</b> applied! Discount: ${discountAmount.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
