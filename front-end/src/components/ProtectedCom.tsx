import { Outlet } from "react-router-dom";
import Intro from "./Intro";

const Protected = () => {
        const check = localStorage.userCount;
        return check ? <Outlet /> : <Intro />;
}

export default Protected;