import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import API from "../services/api";
import { FaShieldAlt, FaSprayCan, FaCarCrash, FaTint, FaTachometerAlt, FaVolumeUp, FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { GiCarWheel } from 'react-icons/gi';

function Home() {
  const [reviews, setReviews] = useState([]);

  // Booking State
  const [bookData, setBookData] = useState({
    name: '', phone: '', vehicle: '', serviceId: 'Full Car Paint Job', date: ''
  });
  const [bookMsg, setBookMsg] = useState('');

  useEffect(() => {
    // Fetch top 3 reviews
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews");
        setReviews(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a booking. Typically needs user logged in, but we handle it via the fast form.
      // We'll post to bookings with dummy user data if not logged in just so admin can see it.
      await API.post("/bookings", {
        userId: "64a0f44358a9d18e5f2cf999", // placeholder system ID or handle properly in backend
        userName: bookData.name,
        userEmail: bookData.phone + "@guest.com", // hack for guest
        serviceId: "Custom Quote",
        serviceName: bookData.serviceId,
        vehicle: bookData.vehicle,
        date: bookData.date
      });
      setBookMsg("Your appointment request has been sent! We will call you shortly.");
      setBookData({ name: '', phone: '', vehicle: '', serviceId: 'Full Car Paint Job', date: '' });
    } catch (err) {
      setBookMsg("Failed to send booking request. Please clear fields and try again.");
    }
  };

  return (
    <div>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="container z-index-2 position-relative">
          <h1 className="display-3 fw-bolder text-white mb-3">Labhante <span className="text-warning">Automotive Studio</span></h1>
          <p className="fs-4 text-light mb-4 text-shadow">
            The Promise of Perfection <br />
            <span className="fs-5 opacity-75">We pour sweat and precision into every detail</span>
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="#services" className="btn btn-warning fw-bold px-4 py-3 rounded-pill text-dark shadow-lg">Explore Services</a>
            <a href="#book" className="btn btn-light text-dark fw-bold px-4 py-3 rounded-pill shadow-lg">Book Appointment</a>
          </div>
        </div>
      </section>

      {/* 2. OUR SERVICES SECTION */}
      <div id="services" className="container mt-5 pt-5 pb-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-white display-5">Our <span className="text-warning">Services</span></h2>
          <p className="text-light fs-5">Premium detailing and customization options for your vehicle</p>
        </div>
        <div className="row g-4 justify-content-center">
          {[
            { title: "PPF Protection", desc: "Paint protection film for scratch resistance", icon: <FaShieldAlt className="text-warning fs-1 mb-3" /> },
            { title: "Ceramic Coating", desc: "Long-lasting shine & paint protection", icon: <FaSprayCan className="text-info fs-1 mb-3" /> },
            { title: "Denting & Painting", desc: "Professional body repair", icon: <FaCarCrash className="text-danger fs-1 mb-3" /> },
            { title: "Car Tint & Wraps", desc: "Premium wraps and sun protection tint", icon: <FaTint className="text-primary fs-1 mb-3" /> },
            { title: "Premium Car Wash", desc: "Deep cleaning & polishing detailing", icon: <FaTint className="text-info fs-1 mb-3" /> },
            { title: "Sound System Upgrade", desc: "High-quality audio installation", icon: <FaVolumeUp className="text-success fs-1 mb-3" /> },
            { title: "Car Tuning", desc: "Performance tuning & ECU optimization", icon: <FaTachometerAlt className="text-danger fs-1 mb-3" /> },
            { title: "Alloy Wheels", desc: "Premium wheel upgrades", icon: <GiCarWheel className="text-secondary fs-1 mb-3" /> }
          ].map((service, index) => (
            <div className="col-12 col-md-6 col-lg-3 d-flex align-items-stretch" key={index}>
              <div className="card shadow border-0 service-card text-center bg-dark w-100 p-4 rounded-4 border-bottom border-warning border-3 hover-lift">
                <div className="card-body p-0 d-flex flex-column align-items-center justify-content-center">
                  {service.icon}
                  <h5 className="card-title fw-bold text-white mb-2">{service.title}</h5>
                  <p className="text-light small mb-0">{service.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHY CHOOSE US */}
      <div className="bg-black py-5 my-5 border-top border-bottom border-dark">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold text-white display-5 mb-4">Why Choose <span className="text-warning">Us?</span></h2>
              <p className="text-light fs-5 mb-4">We don't just wash cars, we restore them to their factory glory. Experience world-class detailing with our standard of excellence.</p>

              <div className="row g-3">
                <div className="col-sm-6"><div className="d-flex align-items-center text-light"><FaCheckCircle className="text-warning me-2" /> Certified technicians</div></div>
                <div className="col-sm-6"><div className="d-flex align-items-center text-light"><FaCheckCircle className="text-warning me-2" /> Premium imported materials</div></div>
                <div className="col-sm-6"><div className="d-flex align-items-center text-light"><FaCheckCircle className="text-warning me-2" /> Latest equipment</div></div>
                <div className="col-sm-6"><div className="d-flex align-items-center text-light"><FaCheckCircle className="text-warning me-2" /> Fast delivery</div></div>
                <div className="col-sm-6"><div className="d-flex align-items-center text-light"><FaCheckCircle className="text-warning me-2" /> Warranty on services</div></div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img src="/images/gallery/img3.jpg" alt="Luxury Detailing" className="img-fluid rounded-4 shadow-lg border border-secondary" style={{ maxWidth: "90%", maxHeight: "400px", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT WORKS / GALLERY */}
      <div className="container py-5" id="gallery">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-white display-5">Featured Cars & <span className="text-warning">Recent Work</span></h2>
          <p className="text-light fs-5">A glimpse into our world of perfection</p>
        </div>
        <div className="row gallery g-4">
          {[
            { img: "img1.jpg", title: "PPF Protection" },
            { img: "img2.jpg", title: "Premium Car Wash" },
            { img: "img3.jpg", title: "Car Tint & Wraps" },
            { img: "img4.jpg", title: "Full Car Restoration" }
          ].map((item, idx) => (
            <div className="col-md-6 col-lg-3" key={idx}>
              <div className="position-relative overflow-hidden rounded-4 shadow-sm group-hover h-100 border border-dark">
                <img src={`/images/gallery/${item.img}`} alt={item.title} className="img-fluid w-100 h-100 object-fit-cover" style={{ minHeight: "300px" }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75 text-white transition-all transform-up">
                  <h6 className="fw-bold mb-0 text-warning">{item.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CUSTOMER REVIEWS */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-white display-5">Customer <span className="text-warning">Reviews</span></h2>
          <p className="text-light fs-5">What our clients say about us</p>
        </div>

        <div className="row justify-content-center g-4">
          {reviews.length > 0 ? reviews.map(r => (
            <div className="col-md-4" key={r._id}>
              <div className="card h-100 border-0 shadow bg-dark rounded-4 p-4 text-center border-bottom border-warning border-3">
                <div className="text-warning fs-4 mb-3">{"⭐".repeat(r.rating)}</div>
                <p className="text-light fst-italic flex-grow-1">"{r.comment}"</p>
                <div className="mt-3 text-light border-top border-secondary pt-3">
                  <h6 className="fw-bold text-white mb-0">{r.userName}</h6>
                  <small className="opacity-75">Verified Customer</small>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-light">No reviews available yet.</div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link to="/reviews" className="btn btn-outline-warning rounded-pill px-4">View All Reviews</Link>
        </div>
      </div>

      {/* 8. BRANDS WE WORK WITH */}
      <div className="bg-black py-4 border-top border-dark mt-5 text-center overflow-hidden">
        <div className="container">
          <h6 className="text-light text-uppercase letter-spacing-2 mb-4">Trusted with Premium Brands</h6>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5 opacity-50">
            {/* Using simple text placeholders for logos to ensure it renders correctly. Ideally these would be SVG icons */}
            {["BMW", "MERCEDES-BENZ", "AUDI", "PORSCHE", "LAND ROVER", "LAMBORGHINI", "TOYOTA"].map((brand, i) => (
              <h4 key={i} className="fw-bolder m-0" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "1px", color: "#ddd" }}>{brand}</h4>
            ))}
          </div>
        </div>
      </div>

      {/* 9. BOOKING SECTION */}
      <div id="book" className="container py-5 my-5">
        <div className="row align-items-center bg-dark rounded-4 shadow-lg overflow-hidden border border-secondary">
          <div className="col-lg-5 p-0 d-none d-lg-block h-100">
            <img src="/images/gallery/img3.jpg" alt="Booking" className="img-fluid h-100 w-100 object-fit-cover" />
          </div>
          <div className="col-lg-7 p-4 p-md-5">
            <h2 className="fw-bold text-white mb-4">Book <span className="text-warning">Appointment</span></h2>
            <p className="text-white mb-4">Leave your details and we will get back to you to confirm your slot.</p>

            {bookMsg && <div className={`alert py-2 ${bookMsg.includes('failed') ? 'alert-danger' : 'alert-success'}`}>{bookMsg}</div>}

            <form onSubmit={handleBookSubmit} className="row g-3">
              <div className="col-md-6">
                <input type="text" className="form-control bg-black text-light border-secondary" placeholder="Full Name" value={bookData.name} onChange={e => setBookData({ ...bookData, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control bg-black text-light border-secondary" placeholder="Phone Number" value={bookData.phone} onChange={e => setBookData({ ...bookData, phone: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control bg-black text-light border-secondary" placeholder="Car Model" value={bookData.vehicle} onChange={e => setBookData({ ...bookData, vehicle: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <input type="date" className="form-control bg-black text-light border-secondary" value={bookData.date} onChange={e => setBookData({ ...bookData, date: e.target.value })} min={new Date().toISOString().split("T")[0]} required />
              </div>
              <div className="col-12">
                <select className="form-select bg-black text-light border-secondary" value={bookData.serviceId} onChange={e => setBookData({ ...bookData, serviceId: e.target.value })}>
                  <option>PPF Protection</option>
                  <option>Ceramic Coating</option>
                  <option>Denting & Painting</option>
                  <option>Car Wash & Detailing</option>
                  <option>Sound System Upgrade</option>
                  <option>Car Tuning / Re-map</option>
                  <option>General Booking</option>
                </select>
              </div>
              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-warning text-dark fw-bold w-100 py-3 rounded-pill fs-5 shadow">Book Service Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 10. LOCATION & CONTACT (Pre-footer) */}
      <div className="container mb-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 bg-dark rounded-4 h-100 border border-secondary shadow">
              <FaPhoneAlt className="text-warning fs-1 mb-3" />
              <h5 className="text-white fw-bold">Call Us</h5>
              <a href="tel:+919100900928" className="text-decoration-none text-light d-block">+91 91009 00928</a>
              <a href="tel:+919848136367" className="text-decoration-none text-light d-block">+91 98481 36367</a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-dark rounded-4 h-100 border border-secondary shadow">
              <FaMapMarkerAlt className="text-warning fs-1 mb-3" />
              <h5 className="text-white fw-bold">Studio Address</h5>
              <p className="text-light small mx-auto" style={{ maxWidth: "250px" }}>H. No 44-326, HB Colony Main Rd, APIIC Colony, Moula Ali, Hyderabad</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-dark rounded-4 h-100 border border-secondary shadow">
              <FaWhatsapp className="text-success fs-1 mb-3" />
              <h5 className="text-white fw-bold">WhatsApp</h5>
              <p className="text-light small mb-2">Send us a photo of your car for a quick quotation.</p>
              <a href="https://wa.me/919100900928" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">Chat Now</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;