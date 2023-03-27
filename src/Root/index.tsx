import React, { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";  

function Root() { 

    return (
        <HashRouter>
            <App />
        </HashRouter>
    );
}

export default Root;
