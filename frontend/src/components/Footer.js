import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact" className="footer bg-dark text-white py-5 mt-5 border-top border-secondary">
      <div className="container">
        <div className="row g-4">

          {/* Column 1: Company Info */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-uppercase text-blue mb-3 fw-bold">Company Information</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-secondary text-decoration-none footer-link-hover">About Us</Link></li>
              <li className="mb-2"><Link to="/services" className="text-secondary text-decoration-none footer-link-hover">Our Services</Link></li>
              <li className="mb-2"><Link to="/#gallery" className="text-secondary text-decoration-none footer-link-hover">Gallery</Link></li>
            </ul>
          </div>

          {/* Column 2: Services Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-uppercase text-blue mb-3 fw-bold">Services Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">PPF Protection</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Ceramic Coating</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Denting & Painting</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Car Wraps & Tint</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Premium Car Wash</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Sound System Upgrades</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Alloy Wheels</Link></li>
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Body Kits</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Support & Legal */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-uppercase text-blue mb-3 fw-bold">Customer Support</h5>
            <ul className="list-unstyled mb-4">
              <li className="mb-2"><Link to="/booking" className="text-secondary text-decoration-none footer-link-hover">Book Appointment</Link></li>
              <li className="mb-2"><Link to="/reviews" className="text-secondary text-decoration-none footer-link-hover">Customer Reviews</Link></li>
              <li className="mb-2"><Link to="/faqs" className="text-secondary text-decoration-none footer-link-hover">FAQs</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-secondary text-decoration-none footer-link-hover">Contact Support</Link></li>
            </ul>

            <h5 className="text-uppercase text-blue mb-3 fw-bold">Legal Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Terms & Conditions</Link></li>
              <li className="mb-2"><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact, Location & Socials */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-uppercase text-blue mb-3 fw-bold">Contact Details</h5>
            <ul className="list-unstyled mb-4 text-secondary small">
              <li className="mb-2"><strong className="text-light">Studio Address:</strong><br />H. No 44-326, HB Colony Main Rd, APIIC Colony, Moula Ali, Hyderabad, Secunderabad, Telangana 500040</li>
              <li className="mb-2"><strong className="text-light">Phone Number:</strong><br /><a href="tel:+919100900928" className="text-secondary text-decoration-none footer-link-hover">+91 91009 00928</a> | <a href="tel:+919848136367" className="text-secondary text-decoration-none footer-link-hover">+91 98481 36367</a></li>
              <li className="mb-2"><strong className="text-light">Email Address:</strong><br /><a href="mailto:labhantecustoms@gmail.com" className="text-secondary text-decoration-none footer-link-hover">labhantecustoms@gmail.com</a></li>
              <li className="mb-2"><strong className="text-light">Working Hours:</strong><br />Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: By Appointment</li>
            </ul>

            <h5 className="text-uppercase text-blue mb-3 fw-bold">Location & Social</h5>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2"><a href="https://www.google.com/maps/search/?api=1&query=H.+No+44-326,+HB+Colony+Main+Rd,+APIIC+Colony,+Moula+Ali,+Hyderabad,+Secunderabad,+Telangana+500040" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none footer-link-hover">Google Maps Location</a></li>
              <li className="mb-1"><a href="https://www.instagram.com/labhanteautomotive?igsh=bDNldzZlcDdieWI0" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none footer-link-hover">Instagram</a></li>
              <li className="mb-1"><a href="#" className="text-secondary text-decoration-none footer-link-hover">Facebook</a></li>
              <li className="mb-1"><a href="#" className="text-secondary text-decoration-none footer-link-hover">YouTube</a></li>
              <li className="mb-1"><a href="https://wa.me/919100900928" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none footer-link-hover">WhatsApp</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-copyright text-center py-4 mt-4 border-top border-secondary small text-secondary">
          © 2026 Labhante Automotive Studio – All Rights Reserved
        </div>
      </div>

      {/* Optional internal CSS styles for hover effects directly in the file for components missing it */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-link-hover:hover {
          color: #4FA8D1 !important;
          transition: 0.3s ease;
        }
      `}} />
    </footer>
  );
}

export default Footer;
