import { Route, Routes } from "react-router-dom"
import Login from "../components/login/Login"
import UserList from "../components/userList/UserList"
import ProtectedRouter from "./ProtectedRouter"


const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRouter />}>
                <Route path="/userList" element={<UserList />} />
            </Route>
        </Routes>
    )
}

export default Routing