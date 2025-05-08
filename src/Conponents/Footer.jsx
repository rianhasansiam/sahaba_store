import React from 'react'

export const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-16">
  <aside>
    <h1 className="text-2xl font-bold text-primary">ShopEase</h1>
    <p className="max-w-xs">
      Your one-stop shop for quality products at affordable prices.
    </p>
  </aside>

  <nav>
    <h6 className="footer-title">Company</h6>
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav>

  <nav>
    <h6 className="footer-title">Legal</h6>
    <a className="link link-hover">Terms of use</a>
    <a className="link link-hover">Privacy policy</a>
    <a className="link link-hover">Cookie policy</a>
  </nav>

  <nav>
    <h6 className="footer-title">Social</h6>
    <div className="grid grid-flow-col gap-4">
      <a><i className="fa-brands fa-facebook text-xl hover:text-blue-600"></i></a>
      <a><i className="fa-brands fa-twitter text-xl hover:text-sky-500"></i></a>
      <a><i className="fa-brands fa-instagram text-xl hover:text-pink-500"></i></a>
    </div>
  </nav>
  <div className="text-center mt-4 text-sm text-gray-500">
  © {new Date().getFullYear()} ShopEase. All rights reserved.
</div>

</footer>

  )
}
