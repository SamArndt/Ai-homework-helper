import React, { useContext } from "react";
import "../App.css"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function ProfileSettings() {
    const nav = useNavigate()

    const {user} = useContext(AuthContext);



return (
    <div className="profilesettings-outer">
        <div className="profilesettings-card">

            <button type="button"
                    className="profilesettings-backbutton"
                    onClick={() => nav('/settings')}
            >
                Back To Settings
            </button>

            <div className="profilesettings-header">
                PROFILE
            </div>

            <h1 className="profilesettings-title">
                Edit Profile
            </h1>


            <div className="profilesettings-grid">


                <div className="profilesettings-input">
                    <label className="profilesettings-inputlabel">
                        First Name
                        <input type="text"
                               value= {user?.first_name || ""}
                               className="profilesettings-inputtext"
                               readOnly
                        />
                    </label>
                </div>


                <div className="profilesettings-input">
                    <label className="profilesettings-inputlabel">
                        Email
                        <input type="text"
                               value= {user?.email|| ""}
                               className="profilesettings-inputtext"
                               readOnly
                        />
                    </label>
                </div>

                <p className="profilesettings-description">
                    Bottom Footer
                </p>

            </div>



        </div>
    </div>










)
}

export default ProfileSettings

