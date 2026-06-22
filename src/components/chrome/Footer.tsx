export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <p>
              <span>UC San Diego 9500 Gilman Dr. La Jolla, CA 92093 (858) 534-2230</span>
              <br />
              <span>Copyright &copy; {new Date().getFullYear()} Regents of the University of California. All rights reserved.</span>
            </p>
            <ul className="footer-links">
              <li><a href="https://accessibility.ucsd.edu/">Accessibility</a></li>
              <li><a href="https://ucsd.edu/about/privacy.html">Privacy</a></li>
              <li><a href="https://ucsd.edu/about/terms-of-use.html">Terms of Use</a></li>
            </ul>
          </div>
          <div className="col-sm-4">
            <img
              src="https://cdn.ucsd.edu/developer/decorator/5.0.2/img/ucsd-footer-logo-white.png"
              alt="UC San Diego"
              className="img-responsive footer-logo"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
