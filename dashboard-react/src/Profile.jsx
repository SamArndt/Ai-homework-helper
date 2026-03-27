import React, { useState } from "react";


export default function Profile() {
    const [activityExpand, setActivityExpand] = useState(false);
    return (



        <div className="profile-outer">
            <div className="profile-inner">

                <p className="profile-upperBound"> Your Account</p>
                <h1 className="profile-title">Your Profile</h1>
                <p className="profile-subtitle">
                    View Account Details and Manage Settings
                </p>

                <div className="profile-grid">

                    <section className="profile-card">
                        <h2 className="profile-card-title"> Personal Information </h2>

                            <div className="profile-card-row">
                                <span className="profile-card-label"> Name: </span>
                                <span className="profile-card-text"> Placeholder Name</span>
                            </div>
                            <div className="profile-card-row">
                                <span className="profile-card-label"> Email: </span>
                                <span className="profile-card-text"> Placeholder Email </span>
                            </div>
                            <div className="profile-card-row">
                                <span className="profile-card-label"> Role: </span>
                                <span className="profile-card-text"> Placeholder Role </span>
                            </div>

                    </section>


                    <section className="profile-card">
                        <h2 className="profile-card-title"> Preferences </h2>

                    
                            <div className="profile-card-row">
                                <span className="profile-card-label"> Option 1 </span>
                                <span className="profile-card-text"> Placeholder Option 1</span>
                            </div>
                            <div className="profile-card-row">
                                <span className="profile-card-label"> Option 2 </span>
                                <span className="profile-card-text"> Placeholder Option 2</span>
                            </div>
                            <div className="profile-card-row">
                                <span className="profile-card-label"> Option 3 </span>
                                <span className="profile-card-text"> Placeholder Option 3</span>
                            </div>
                    </section>

                    <section className={`profile-card profile-card-activity ${activityExpand ? "profile-card-activity-expand" : ""}`}>

                        <div className="profile-activity-header">
                        <h2 className="profile-card-title"> Activity</h2>


                        <button type="button"
                                className="profile-card-activity-dropdown"
                                onClick={() => setActivityExpand (!activityExpand)}
                            >
                                {activityExpand ? "Show Less" : "Show More"}

                        </button>
                    </div>

                        <div className="profile-activity-scroll">
                            <p className="profile-null">
                                All Activity/History Will Appear Below...
                            </p>


                            <p className="profile-card-bodytext"> Additional Dropdown Option 1</p>
                            <p className="profile-card-bodytext"> Additional Dropdown Option 2</p>
                            <p className="profile-card-bodytext"> Additional Dropdown Option 3</p>
                            <p className="profile-card-bodytext"> Additional DropdownOption 4</p>
                            <p className="profile-card-bodytext"> Additional Dropdown Option 5</p>
                            <p className="profile-card-bodytext"> Additional Dropdown Option 6</p>
                            <p className="profile-card-bodytext"> Additional Dropdown Option 7</p>
                            </div>
                    </section>


                </div>



            </div>
        </div>


    )
}