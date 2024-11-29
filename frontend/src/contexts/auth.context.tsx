import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated,setIsAuthenticated] = useState<string>("");

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/auth/check-auth', { withCredentials: true });
                setIsAuthenticated(response.data.token);
            } catch (error) {
                console.log(error);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 