import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRouter = () => {
    const token = useSelector((state: RootState) => state.auth.token)
    return token ? <Outlet /> : <Navigate to={'/'} replace />;
}

export default ProtectedRouter