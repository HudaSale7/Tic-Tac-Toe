import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Intro = () => {
    const [clickedX, setClickedX] = useState(false);
    const [clickedO, setClickedO] = useState(false);
    const [display, setDisplay] = useState("hidden");
    const [Join, setJoin] = useState("hidden");
    const [roomId, setRoomId] = useState("Loading...");
    const [isCopied, setIsCopied] = useState(false);
    const [customId, setCustomId] = useState("");
    const [error, setError] = useState(false);
    const [errorMassage, setErrorMassage] = useState("");
    const navigate = useNavigate();
    const handleSymbol = (s: string) => { 
        setError(false);
        if (s === "X") {
            setClickedX(true);
            setClickedO(false);
        }
        else {
            setClickedO(true);
            setClickedX(false);
        }
        socket.emit("create-room", { symbol: s });
    }
    const handleInvite = () => {
        if (!clickedO && !clickedX) {
            setError(true);
            setErrorMassage("Please select a symbol first!");
            return;
        }
        setError(false);
        setDisplay("visible");
        setJoin("hidden");
    }

    const handleJoin = () => {
        setError(false);
        setJoin("visible");
        setDisplay("hidden");
    }

    const handleJoinWithId = () => {
        setError(false);
        sessionStorage.setItem("roomId", customId);
        socket.emit("join-room", { roomId: customId });
    }

    useEffect(() => {
        socket.on("room-id", (msg) => {
            sessionStorage.setItem("roomId", msg.roomId);
            setRoomId(msg.roomId);
        });
        
        socket.on("start-game", () => {
            navigate("/board");
        });
        
        socket.on("error", (msg) => {
            setError(true);
            setErrorMassage(msg.error)
        })
    }, [navigate]);
    
    return ( 
        <div className="layer">
            {error ? <p>{ errorMassage}</p> : null}
            <div className="div-symbol">
                <button className={`symbol ${clickedX ? "clicked" : ""}`}
                    onClick={() => handleSymbol("X")}
                >X</button>
                <button className={`symbol ${clickedO ? "clicked" : ""}`}
                    onClick={() => handleSymbol("O")}
                >O</button>
            </div>
            <div>
                <button className="invite"
                onClick={() => handleInvite()}
                >Invite</button>
                <button className="invite"
                onClick={() => handleJoin()}
                >Join by id</button>
            </div>
            <div className={display}>
            <input type="text" value={roomId} readOnly={true} />
                <CopyToClipboard
                    text={roomId}
                onCopy={() => {setIsCopied(true)} }>
                <button>Copy Link</button>
                </CopyToClipboard>
                {isCopied ? <span>Copied.</span> : null}
            </div>
            <div className={Join}>
                <input type="text" placeholder="Enter Room ID"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                />
                <button onClick={() => handleJoinWithId()}
                >Join</button>
            </div>
        </div>
    );
}

export default Intro;