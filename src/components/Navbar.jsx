import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <a
        className="navbar-brand"
        href="/dashboard"
        aria-label="DevPulse Dashboard"
      >
        <span className="brand-dot" />
        <span>DevPulse</span>
      </a>

      <div className="navbar-user">
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="avatar"
          />
        )}

        <span className="username">
          @{user?.username}
        </span>

        <button
          onClick={logout}
          className="logout-btn"
          type="button"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;