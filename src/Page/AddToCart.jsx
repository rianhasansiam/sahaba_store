import { useContext, useEffect } from "react";
import { contextData } from "../Contex";
import { useFetchData } from "../hooks/useFetchData";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import AddtocartProduct from "../Conponents/AddtocartProduct";
import { useDeleteData } from "../hooks/useDeleteData";




const AddToCart = () => {
  const { userData } = useContext(contextData);

  // Fetch cart items from the API
  const { data, isLoading, error, refetch } = useFetchData(
    "cartItems",
    `/addtocart-list?email=${userData?.email}`
  );


  useEffect(()=>{

refetch()

  },[])
  // Check if data exists and ensure it's an array of cartItems
  const cartItems = Array.isArray(data?.cartItems) ? data.cartItems : [];

  // Use delete hook for cart item removal
  const { mutate: deleteCartItem } = useDeleteData("cartItems");

  // Handle loading and error states
  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Calculate subtotal, discount, and total
  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const price = typeof item.price === "number" ? item.price : Number(item.price) || 0;
    return sum + (price * quantity);
  }, 0);

  const discount = 35.52;
  const total = subtotal - discount;

  const handleDelete = (id) => {
    deleteCartItem(id); // Remove item from cart using the delete mutation
  };

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
                    key={item._id} 
                    refetch={refetch}
                    onDelete={() => handleDelete(item._id)} // Handle delete
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
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium mt-4">
                  Proceed to Checkout
                </button>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  Estimated Delivery by {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Have a Coupon?</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#167389] focus:border-[#167389]"
                  />
                  <button className="bg-[#167389] hover:bg-[#135a6e] text-white px-4 py-2 rounded-r-md">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
