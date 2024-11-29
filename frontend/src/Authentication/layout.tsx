import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <h1>Homepage</h1>
      <button><Link to="/login">Login</Link></button>
      <button><Link to="/signup">Signup</Link></button>
    </div>
  )
}
