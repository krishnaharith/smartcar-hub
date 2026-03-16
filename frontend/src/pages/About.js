import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div>
      <Navbar />

      <div className="container mt-5 pt-5 text-center">
        <h2 className="fw-bold text-white mb-4">About Labhante</h2>
        <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: "800px" }}>
          At our studio, every car isn't just a vehicle it's a dream, a pride, a passion waiting to roar to life. We've built something different: a haven where car enthusiasts like you bring their cherished rides, knowing our relentless hard work transforms them into breathtaking masterpieces.
        </p>

        <div className="row justify-content-center mt-5">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 service-card text-white bg-dark p-4 h-100">
              <h3 className="text-blue fw-bold display-4">500+</h3>
              <h5 className="fw-bold mt-2">Premium Vehicles Serviced</h5>
              <p className="text-secondary m-0 mt-3 small">
                Over the past decade, we have successfully restored, protected, and upgraded over 500 premium vehicles,
                giving our clients an unmatched automotive experience.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 service-card text-white bg-dark p-4 h-100">
              <h3 className="text-blue fw-bold display-4">100%</h3>
              <h5 className="fw-bold mt-2">Satisfaction</h5>
              <p className="text-secondary m-0 mt-3 small">
                We guarantee breathtaking results on every vehicle. Our meticulous processes ensure your automotive masterpiece remains flawless.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 service-card text-white bg-dark p-4 h-100">
              <h3 className="text-blue fw-bold display-4">24/7</h3>
              <h5 className="fw-bold mt-2">Client Support</h5>
              <p className="text-secondary m-0 mt-3 small">
                Our team provides round-the-clock support to guarantee your peace of mind regarding maintenance and post-service care.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
