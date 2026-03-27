import React from "react";
import '../App.css'
import { useNavigate } from "react-router-dom";

function SettingsPlaceholder({ title, description }) {


    const nav = useNavigate();


    return (
        <div className="settings-placeholder-outer">
            <div className="settings-placeholder-card">

                <button type = "button"
                        className="settings-placeholder-backbutton"
                        onClick={() => nav('/settings')}
                >
                    Go Back To Settings
                </button>

                <div className="settings-placeholder-header">
                    SETTINGS
                </div>

                <h1 className="settings-placeholder-title">
                    {title}
                </h1>

                <p className="settings-placeholder-description">
                    {description}
                </p>



            </div>
        </div>
    )
}

export default SettingsPlaceholder
