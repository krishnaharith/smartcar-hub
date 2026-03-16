import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await API.post("/users/forgot-password", { email });
      setMsg({ type: "success", text: res.data.message });
      setStep(2);
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Failed to send OTP." });
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await API.post("/users/verify-otp", { email, otp });
      setMsg({ type: "success", text: res.data.message });
      setStep(3);
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Invalid OTP." });
    }
    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: "danger", text: "Passwords do not match!" });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: "danger", text: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await API.post("/users/reset-password", { email, otp, newPassword });
      setMsg({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Failed to reset password." });
    }
    setLoading(false);
  };

  const stepTitles = ["Forgot Password", "Enter OTP", "Set New Password"];
  const stepIcons = ["✉️", "🔑", "🔒"];

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary-subtle">
      <Navbar />
      <div className="container mt-5 flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-white">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4FA8D1, #d4af37)' }}></div>

            {/* Step indicators */}
            <div className="d-flex justify-content-center gap-2 pt-4 px-4">
              {[1, 2, 3].map(s => (
                <div key={s} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold mb-1"
                    style={{
                      width: 36, height: 36, fontSize: 14,
                      background: step >= s ? 'linear-gradient(135deg, #4FA8D1, #d4af37)' : '#333',
                      color: '#fff', transition: 'all 0.3s'
                    }}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && <div style={{ height: 2, width: '100%', background: step > s ? '#4FA8D1' : '#333', position: 'absolute', marginTop: 17 }}></div>}
                </div>
              ))}
            </div>

            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-1 fw-bold" style={{ color: '#4FA8D1' }}>
                {stepIcons[step - 1]} {stepTitles[step - 1]}
              </h2>
              <p className="text-center text-secondary mb-4 small">
                {step === 1 && "We'll send a 6-digit OTP to your registered email."}
                {step === 2 && `OTP sent to ${email}. Check your inbox.`}
                {step === 3 && "Almost done! Set your new password."}
              </p>

              {msg.text && (
                <div className={`alert alert-${msg.type} py-2 text-center rounded-3`}>
                  {msg.text}
                </div>
              )}

              {/* STEP 1: Email */}
              {step === 1 && (
                <form onSubmit={handleSendOTP}>
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">Email Address</label>
                    <input
                      type="email"
                      className="form-control bg-secondary text-white border-dark py-2"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-warning w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP →"}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">6-Digit OTP</label>
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-dark py-2 text-center fs-4 fw-bold letter-spacing-3"
                      placeholder="— — — — — —"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                      required
                    />
                    <small className="text-secondary">OTP expires in 10 minutes.</small>
                  </div>
                  <button type="submit" className="btn btn-warning w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP →"}
                  </button>
                  <button type="button" className="btn btn-link text-secondary w-100 mt-2 small" onClick={() => { setStep(1); setOtp(""); setMsg({ type: "", text: "" }); }}>
                    ← Change email / Resend OTP
                  </button>
                </form>
              )}

              {/* STEP 3: New password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label text-light fw-medium">New Password</label>
                    <input
                      type="password"
                      className="form-control bg-secondary text-white border-dark py-2"
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control bg-secondary text-white border-dark py-2"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-warning w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                    {loading ? "Resetting..." : "🔒 Reset Password"}
                  </button>
                </form>
              )}

              <div className="mt-4 pt-3 text-center border-top border-secondary">
                <Link to="/login" className="text-secondary text-decoration-none small">← Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotPassword;
