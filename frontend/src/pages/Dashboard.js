import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // Vehicle state
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", licensePlate: "", color: "" });
  const [vehicleMsg, setVehicleMsg] = useState("");

  // Booking/Tracking state
  const [bookings, setBookings] = useState([]);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Fetch vehicles
    const fetchVehicles = async () => {
      try {
        const res = await API.get(`/vehicles/${parsedUser._id}`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
      }
    };
    
    // Fetch bookings for tracking
    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/user/${parsedUser._id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchVehicles();
    fetchBookings();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        userName: user.name,
        userEmail: user.email,
        rating,
        comment
      });
      setReviewMsg("Review submitted successfully! Thank you.");
      setComment("");
      setRating(5);
    } catch (err) {
      setReviewMsg("Failed to submit review. Try again later.");
    }
  };

  const submitVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/vehicles", { ...newVehicle, userId: user._id });
      setVehicles([...vehicles, res.data]);
      setVehicleMsg("Vehicle added successfully!");
      setNewVehicle({ make: "", model: "", year: "", licensePlate: "", color: "" });
    } catch (err) {
      setVehicleMsg("Failed to add vehicle.");
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) {
      console.error("Failed to delete vehicle", err);
    }
  };

  const getTrackingStages = (currentStatus) => {
    const stages = [
      "Car Received",
      "Inspection Completed", 
      "Service Started",
      "Work in Progress",
      "Quality Check",
      "Service Completed",
      "Ready for Delivery"
    ];
    
    const currentIndex = stages.indexOf(currentStatus);
    return stages.map((stage, idx) => ({
      name: stage,
      completed: idx <= currentIndex,
      active: idx === currentIndex
    }));
  };

  if (!user) return <div className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center">Loading...</div>;

  return (
    <div className="d-flex min-vh-100 bg-secondary-subtle">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4 d-flex flex-column" style={{ width: "280px", position: "fixed", height: "100vh", overflowY: "auto" }}>
        <h3 className="fw-bold mb-4 text-warning">Labhante</h3>
        
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li className="nav-item">
            <button onClick={() => setActiveTab("dashboard")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "dashboard" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "dashboard" ? "#4FA8D1" : "transparent" }}>Dashboard</button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveTab("vehicles")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "vehicles" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "vehicles" ? "#4FA8D1" : "transparent" }}>My Vehicles</button>
          </li>
          <li className="nav-item"><Link to="/booking" className="nav-link text-white opacity-75 hover-opacity-100">Book Service</Link></li>
          <li className="nav-item">
            <button onClick={() => setActiveTab("bookings")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "bookings" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "bookings" ? "#4FA8D1" : "transparent" }}>My Bookings</button>
          </li>

          <li className="nav-item">
            <button onClick={() => setActiveTab("notifications")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "notifications" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "notifications" ? "#4FA8D1" : "transparent" }}>Notifications</button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveTab("reviews")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "reviews" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "reviews" ? "#4FA8D1" : "transparent" }}>Reviews</button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveTab("profile")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "profile" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "profile" ? "#4FA8D1" : "transparent" }}>Profile</button>
          </li>
        </ul>
        
        <hr className="bg-secondary" />
        <button onClick={handleLogout} className="btn btn-outline-danger text-start w-100 fw-bold border-0">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-5" style={{ marginLeft: "280px" }}>
        
        {activeTab === "dashboard" && (
          <>
            <div className="row mb-4">
              <div className="col">
                <h1 className="fw-bold text-dark">
                  Welcome back, <span className="text-warning">{user.name}</span>
                </h1>
                <p className="text-muted">Here is an overview of your account and services.</p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100 bg-white rounded-4 overflow-hidden border-start border-4 border-warning">
                    <div className="card-body p-4">
                      <h5 className="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Active Services</h5>
                      <h2 className="display-4 text-dark fw-bolder mb-0">{bookings.length}</h2>
                      <button className="btn btn-link text-success p-0 mt-2 small text-decoration-none" onClick={() => setActiveTab("bookings")}><i className="bi bi-arrow-up-circle me-1"></i>Track latest</button>
                    </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100 bg-white rounded-4 overflow-hidden border-start border-4 border-info">
                    <div className="card-body p-4">
                      <h5 className="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Registered Vehicles</h5>
                      <h2 className="display-4 text-dark fw-bolder mb-0">{vehicles.length}</h2>
                      <button className="btn btn-link text-muted p-0 mt-2 small text-decoration-none" onClick={() => setActiveTab("vehicles")}>Manage vehicles <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "vehicles" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h2 className="fw-bold mb-0">My Vehicles</h2>
              <button className="btn btn-warning fw-bold text-dark px-4 rounded-pill" data-bs-toggle="collapse" data-bs-target="#addVehicleForm">
                + Add New Vehicle
              </button>
            </div>

            <div className="collapse mb-4" id="addVehicleForm">
              <div className="card shadow-sm border-0 p-4 rounded-4 bg-white" style={{ maxWidth: "800px" }}>
                <h5 className="fw-bold mb-3">Register a Vehicle</h5>
                {vehicleMsg && <div className="alert alert-info py-2">{vehicleMsg}</div>}
                
                <form onSubmit={submitVehicle} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Make (e.g., Honda)</label>
                    <input type="text" className="form-control" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Model (e.g., Civic)</label>
                    <input type="text" className="form-control" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Year</label>
                    <input type="number" className="form-control" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">License Plate</label>
                    <input type="text" className="form-control" value={newVehicle.licensePlate} onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Color</label>
                    <input type="text" className="form-control" value={newVehicle.color} onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})} />
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-dark fw-bold px-4 rounded-pill">Save Vehicle</button>
                  </div>
                </form>
              </div>
            </div>

            {vehicles.length === 0 ? (
              <div className="card shadow-sm border-0 p-5 rounded-4 text-center">
                <i className="bi bi-car-front text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                <h4 className="fw-bold">No Vehicles Found</h4>
                <p className="text-muted">You have no registered vehicles attached to your profile.</p>
              </div>
            ) : (
              <div className="row g-4">
                {vehicles.map(v => (
                  <div className="col-md-6 col-lg-4" key={v._id}>
                    <div className="card shadow-sm border-0 bg-white rounded-4 p-4 h-100 position-relative border-start border-4 border-primary">
                       <button onClick={() => deleteVehicle(v._id)} className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 rounded-circle" title="Remove Vehicle">
                         <i className="bi bi-trash"></i>
                       </button>
                       <h5 className="fw-bold mb-1">{v.year} {v.make} {v.model}</h5>
                       <p className="text-muted small mb-3">License: <span className="text-dark fw-bold">{v.licensePlate}</span></p>
                       <div className="d-flex align-items-center mt-auto">
                         <span className="badge bg-light border text-dark me-2">Color: {v.color || 'N/A'}</span>
                         <span className="badge bg-success bg-opacity-10 text-success border border-success">Verified</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
               <h2 className="fw-bold mb-0">My Service Bookings</h2>
               <Link to="/booking" className="btn btn-warning fw-bold text-dark px-4 rounded-pill">
                 + New Booking
               </Link>
            </div>

            {bookings.length === 0 ? (
               <div className="card shadow-sm border-0 p-5 rounded-4 text-center mt-4">
                 <i className="bi bi-calendar-x text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                 <h4 className="fw-bold">No Active Bookings</h4>
                 <p className="text-muted">You don't have any service appointments scheduled.</p>
               </div>
            ) : (
               <div className="row g-4">
                 {bookings.map(booking => (
                   <div className="col-12" key={booking._id}>
                     <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
                       <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
                         <div>
                           <h5 className="mb-0 fw-bold">{booking.vehicle}</h5>
                           <span className="badge bg-warning text-dark mt-1">{booking.serviceName || 'Service Package'}</span>
                         </div>
                         <div className="text-end small">
                           <span className="opacity-75 d-block">Booked For:</span>
                           <strong className="text-white">{new Date(booking.date).toLocaleDateString()}</strong>
                         </div>
                       </div>
                       <div className="card-body p-4 bg-light">
                         <h6 className="fw-bold text-muted mb-4 uppercase text-center letter-spacing-1">Live Tracking Status</h6>
                         
                         {(() => {
                           const stages = getTrackingStages(booking.trackingStatus || 'Car Received');
                           const activeIdx = stages.findIndex(s => s.active) !== -1 ? stages.findIndex(s => s.active) : (stages.every(s => s.completed) ? stages.length - 1 : 0);
                           const progressWidth = `${(Math.max(0, activeIdx) / (stages.length - 1)) * 100}%`;
                           
                           return (
                             <div className="position-relative mt-4 mb-4">
                                <div className="position-absolute" style={{left: "18px", right: "18px", top: "16px", zIndex: 1}}>
                                   <div className="bg-secondary opacity-25 w-100 rounded" style={{height: "4px"}}></div>
                                   <div className="bg-primary position-absolute top-0 start-0 rounded" style={{height: "4px", width: progressWidth, transition: 'width 0.5s ease'}}></div>
                                </div>
                                
                                <div className="d-flex justify-content-between position-relative z-index-2">
                                  {stages.map((stage, idx) => (
                                    <div className="d-flex flex-column align-items-center position-relative" key={idx} style={{zIndex: 2, width: "36px"}}>
                                      <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 mx-auto ${stage.active ? 'bg-primary text-white shadow-sm border border-2 border-primary' : stage.completed ? 'bg-primary text-white border border-2 border-primary' : 'bg-white text-secondary border border-2 border-secondary'}`} style={{width: "36px", height: "36px", transition: "0.3s all"}}>
                                        {stage.completed ? <i className="bi bi-check-lg fs-5"></i> : (stage.active ? <span className="spinner-border spinner-border-sm text-white" role="status"></span> : <i className="bi bi-circle opacity-50" style={{fontSize: "0.5rem"}}></i>)}
                                      </div>
                                      <div className={`position-absolute text-center lh-sm mt-1 px-1 ${stage.active ? 'text-primary fw-bold' : stage.completed ? 'text-primary fw-medium' : 'text-muted'}`} style={{ fontSize: '0.70rem', width: '80px', top: '40px' }}>
                                        {stage.name}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{height: "50px"}}></div> {/* Spacing to account for absolute text */}
                             </div>
                           );
                         })()}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}



        {activeTab === "notifications" && (
          <div>
            <h2 className="fw-bold mb-4 border-bottom pb-2">Notifications</h2>
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div className="alert alert-info border-0 shadow-sm border-start border-4 border-info d-flex align-items-center">
                <i className="bi bi-info-circle-fill me-3 fs-4 text-info"></i>
                <div>
                  <h6 className="fw-bold mb-1">Welcome to Labhante Customs!</h6>
                  <p className="mb-0 small text-muted">Complete your profile and book your first detailing service today to get started.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="fw-bold mb-4 border-bottom pb-2">My Profile</h2>
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white" style={{ maxWidth: "600px" }}>
              <div className="mb-3">
                <label className="form-label fw-bold opacity-75">Full Name</label>
                <input type="text" className="form-control form-control-lg bg-light" value={user.name} readOnly />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold opacity-75">Email Address</label>
                <input type="email" className="form-control form-control-lg bg-light" value={user.email} readOnly />
              </div>
              <button className="btn text-white fw-bold px-4 rounded-pill" style={{ backgroundColor: "#4FA8D1" }}>Save Details</button>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="fw-bold mb-4 border-bottom pb-2">Leave a Review</h2>
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white" style={{ maxWidth: "600px" }}>
              <p className="text-muted mb-4">We value your feedback! Rate your experience with Labhante Customs below.</p>
              
              {reviewMsg && (
                <div className={`alert border-0 border-start border-4 ${reviewMsg.includes("success") ? "alert-success border-success" : "alert-danger border-danger"}`}>
                  {reviewMsg}
                </div>
              )}

              <form onSubmit={submitReview}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Overall Rating</label>
                  <select className="form-select form-select-lg" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={5}>⭐⭐⭐⭐⭐ - Excellent (5)</option>
                    <option value={4}>⭐⭐⭐⭐ - Very Good (4)</option>
                    <option value={3}>⭐⭐⭐ - Average (3)</option>
                    <option value={2}>⭐⭐ - Poor (2)</option>
                    <option value={1}>⭐ - Terrible (1)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold">Your Comments</label>
                  <textarea 
                    className="form-control shadow-sm" 
                    rows="5" 
                    placeholder="Tell us what you loved about our service... or what we can improve!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn text-white fw-bold px-4 py-2 rounded-pill shadow" style={{ backgroundColor: "#4FA8D1" }}>
                  Submit Rating & Review
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;