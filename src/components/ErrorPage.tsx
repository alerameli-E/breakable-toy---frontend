import React from "react";
import "../Styles/ErrorPage.css"


function ErrorPage(){

    return(
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>There has been an error while loading the page.</p>
        </div>
    )
}

export  default ErrorPage