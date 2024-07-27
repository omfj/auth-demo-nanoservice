import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/api";

const HeaderLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link className="px-2 hover:underline" to={to}>
        {children}
      </Link>
    </li>
  );
};

export const Header = () => {
  const navigate = useNavigate();
  const { auth, signOut } = useAuth();

  return (
    <header className="flex items-center p-6">
      <h1 className="text-2xl font-bold">Auth Demo</h1>

      <nav className="flex flex-1 items-center justify-end">
        <ul className="flex items-center gap-0.5">
          <HeaderLink to="/">Home</HeaderLink>
          {!auth && <HeaderLink to="/login">Login</HeaderLink>}
          {!auth && <HeaderLink to="/register">Register</HeaderLink>}
          {!!auth && <HeaderLink to="/profile">{auth.username}</HeaderLink>}
          {!!auth && (
            <li>
              <button
                className="px-2 py-1 rounded-md bg-blue-500 text-white"
                onClick={() => {
                  signOut().then(() => navigate("/"));
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
