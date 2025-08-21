import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const { token } = useSelector((state) => state.auth);

  return (
    <div
      className="offcanvas offcanvas-start bg-light"
      tabIndex="-1"
      id="sidebarMenu"
      aria-labelledby="sidebarMenuLabel"
    >
      <div className="offcanvas-header">
        <h5 id="sidebarMenuLabel">Menu</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="list-unstyled">
          {!token && (
            <>
              <li>
                <Link to="/login" data-bs-dismiss="offcanvas">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" data-bs-dismiss="offcanvas">
                  Register
                </Link>
              </li>
            </>
          )}

          {token && (
            <>
              <li>
                <Link to="/map" data-bs-dismiss="offcanvas">
                  Map
                </Link>
              </li>
              <li>
                <Link to="/upload" data-bs-dismiss="offcanvas">
                  Upload
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
