import React from 'react'

export const Footer = () => {
  return (
   <footer className="bg-white text-black border-t ">
  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
    
    {/* CONTACT */}
    <div>
      <h3 className="font-bold mb-2">CONTACT</h3>
      <p>House 42, Road 3/A, Dhanmondi, Dhaka, Bangladesh</p>
      <p className="mt-2">Email: skybuybd@gmail.com</p>
      <p>Phone: 09613828606</p>
    </div>

    {/* BRANDS & SOCIAL */}
    <div className="col-span-1 md:col-span-1 text-center">
      {/* <img src="/logo.png" alt="Logo" className="w-24 mx-auto mb-2" /> */}
      <h1>Logo</h1>

  <div className="flex justify-center gap-4 my-2">
  <a href="https://www.facebook.com/rianhasan1971" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook text-2xl text-blue-500"></i>
  </a>
  <a href="https://www.facebook.com/rianhasan1971" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram text-2xl text-pink-600"></i>
  </a>
  <a href="https://www.facebook.com/rianhasan1971" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-youtube text-2xl text-red-500"></i>
  </a>
  <a href="https://www.facebook.com/rianhasan1971" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin text-2xl text-blue-500"></i>
  </a>
  <a href="https://www.facebook.com/rianhasan1971" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-tiktok text-2xl"></i>
  </a>
</div>


      <p className="mt-2">Heading name Sahabastore</p>
      <div className="flex justify-center gap-3 mt-3">
        {/* <img src="/skybuy.png" alt="SkyBuy" className="h-10" />
        <img src="/skyship.png" alt="SkyShip" className="h-10" />
        <img src="/express.png" alt="Express" className="h-10" /> */}
        <h1>Logo if i want to add</h1>
      </div>
    </div>

    {/* CUSTOMER LINKS */}
    <div>
      <h3 className="font-bold mb-2">CUSTOMER</h3>
      <ul className="space-y-1">
        <li><a href="#">Account</a></li>
        <li><a href="#">Cart</a></li>
        <li><a href="#">Wishlist</a></li>
        <li><a href="#">Shipping Charge</a></li>
        <li><a href="#">Retail Purchase</a></li>
        <li><a href="#">FAQ</a></li>
      </ul>
    </div>

    {/* INFORMATION LINKS */}
    <div>
      <h3 className="font-bold mb-2">INFORMATION</h3>
      <ul className="space-y-1">
        <li><a href="#">About us</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Returns & Refund</a></li>
        <li><a href="#">Terms & Conditions</a></li>
        <li><a href="#">Secured Payment</a></li>
      </ul>
    </div>

    {/* MOBILE APPS */}
    <div>
      <h3 className="font-bold mb-2">MOBILE APPS</h3>
      <div className="space-y-2">
        <img src="https://thumbs.dreamstime.com/b/google-play-app-store-icons-google-play-app-store-icons-editable-vector-illustration-isolated-white-background-123024624.jpg" alt="Google Play" className="w-32" />
        {/* <img src="/app-store.png" alt="App Store" className="w-32" /> */}
      </div>
    </div>
  </div>

  {/* PAYMENT & COPYRIGHT */}
  <div className="border-t py-6 text-center">
    <p className="text-sm">© 2025 Sahabastore - All Rights Reserved</p>
  </div>
</footer>


  )
}
