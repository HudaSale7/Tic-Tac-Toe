import { useEffect } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const Intro = () => {
    const navigate = useNavigate()
    const handleSymbol = (s: string = "X") => { 
        let symbol: string ;
        if (s === "X") symbol = "O";
        else symbol = "X";
        socket.emit("choose-symbol", { mySymbol: s, otherSymbol: symbol });
    }
    useEffect(() => {
        socket.on("start-game", (data) => {
            if (data.count === 2) {
                localStorage.setItem("userCount", "true");
                navigate("/board");
            }
        });
    }, [navigate]);
    
    return ( 
        <div className="layer">
            <button 
                onClick={() => handleSymbol("X")}
            >X</button>
            <button
                onClick={() => handleSymbol("O")}
            >O</button>
        </div>
    );
}

export default Intro;