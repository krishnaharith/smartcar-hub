import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="bg-secondary-subtle min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container flex-grow-1 py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bolder text-dark display-4">Customer <span className="text-blue">Reviews</span></h1>
          <p className="text-muted fs-5">See what our clients have to say about our detailing and customs services.</p>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center mt-5 p-5 bg-white rounded-4 shadow-sm">
            <i className="bi bi-chat-left-dots text-muted mb-3" style={{ fontSize: "3rem" }}></i>
            <h4 className="fw-bold">No Reviews Yet</h4>
            <p className="text-muted">Be the first to share your experience with Labhante Customs!</p>
          </div>
        ) : (
          <div className="row g-4">
            {reviews.map((r) => (
              <div className="col-12 col-md-6 col-lg-4" key={r._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 bg-light px-3 py-1 rounded-bl-3 text-warning fw-bold border-start border-bottom">
                    {"⭐".repeat(r.rating)}
                  </div>
                  
                  <div className="d-flex align-items-center mb-3 mt-2">
                    <div className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold fs-5 shadow-sm" style={{ width: "50px", height: "50px" }}>
                      {r.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{r.userName}</h6>
                      <small className="text-muted">{new Date(r.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                  
                  <p className="text-secondary fst-italic mb-0" style={{ lineHeight: "1.6" }}>
                    "{r.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Reviews;
