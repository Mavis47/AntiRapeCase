import { useAuth } from '../contexts/auth.context';
import { Outlet } from 'react-router-dom';

export default function PrivateRoute() {

    const {isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <h1>Login To Access...</h1>;
}
