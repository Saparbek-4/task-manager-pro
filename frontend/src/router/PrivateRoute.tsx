import { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
    children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
