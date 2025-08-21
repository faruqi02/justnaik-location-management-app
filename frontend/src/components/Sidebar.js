import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { logoutUser, clearSessionExpired } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
function Sidebar({ isOpen, toggle }) {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div
      className="bg-light border-end vh-100 position-fixed"
      style={{
        width: "200px",
        top: 0,
        left: isOpen ? "0" : "-200px",
        transition: "left 0.3s ease",
        zIndex: 1040,
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Menu</h5>
        {/* Unicode Close × */}
        <button
          className=" btn-close"
          onClick={toggle}
          style={{ fontSize: "1.2rem" }}
        >

        </button>
      </div>
      <ul className="list-unstyled p-3">
        {!token && (
          <>
            <li className="mb-2">
              <Link
                to="/login"
                onClick={toggle}
                className="text-decoration-none d-block py-2 px-3 rounded hover-link"
              >
                🔑 Login
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/register"
                onClick={toggle}
                className="text-decoration-none d-block py-2 px-3 rounded hover-link"
              >
                📝 Register
              </Link>
            </li>
          </>
        )}

        {token && (
          <>
            <li className="mb-2">
              <Link
                to="/map"
                onClick={toggle}
                className="text-decoration-none d-block py-2 px-3 rounded hover-link"
              >
                🗺 Map
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/upload"
                onClick={toggle}
                className="text-decoration-none d-block py-2 px-3 rounded hover-link"
              >
                ⬆️ Upload
              </Link>
            </li>
            <li className="mb-2">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>

          </>
        )}
      </ul>

    </div>
  );
}

export default Sidebar;
