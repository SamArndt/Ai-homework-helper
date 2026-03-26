import React from "react";
import './App.css';


export default function Settings() {
    return (

        <div className="settings-outer">
            <div className="settings-inner">

                <div className="settings-upperBound">
                    INFORMATION
                </div>

                <h1 className="settings-title">
                    SETTINGS
                </h1>

                <h3 className="settings-subtitle">
                    Manage details, preferences, and privacy settings
                </h3>
{/*  PROFILE   */}
                <div className="settings-layout">
                    <section className="settings-divider">
                        <div className="settings-divider-header">
                            PROFILE
                    </div>

                    <div className="settings-card">
                        <div className="settings-row">
                            <div className="settings-leftRow">
                                <div className="settings-rowTitle">
                                    EDIT PROFILE
                                </div>
                            <div className="settings-rowSubtitle">
                                Update Your Personal Information
                            </div>
                        </div>
                    </div>
{/*  PASSWORD   */}
                    <div className="settings-row">
                        <div className="settings-leftRow">
                            <div className="settings-rowTitle">
                                CHANGE PASSWORD
                            </div>
                            <div className="settings-rowSubtitle">
                                Update Account Security
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="settings-divider">
                <div className="settings-divider-header">
                    APP PREFERENCES
                </div>

                <div className="settings-card">
                    <div className="settings-row">
{/*  ALERTS   */}
                        <div className="settings-leftRow">
                            <div className="settings-rowTitle">
                                ALERTS
                            </div>

                            <div className="settings-rowSubtitle">
                                Manage Notifications And Reminders
                            </div>
                        </div>

                        <div className="settings-rightRow">
                            <label className="settings-toggle">
                                <input type="checkbox" defaultChecked />
                                    <span className="settings-slider"></span>
                            </label>
                        </div>
                    </div>

{/*  L/D MODES   */}
                    <div className="settings-row">
                        <div className="settings-leftRow">
                            <div className="settings-rowTitle">
                                MODE
                            </div>

                            <div className="settings-rowSubtitle">
                                Switch Between Light And Dark Mode(s)
                            </div>
                        </div>

                            <div className="settings-rightRow">
                            <label className="settings-toggle">
                                    <input type="checkbox" />
                            <span className="settings-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                </section>

{/*  SECURITY   */}


                <section className="settings-divider">
                    <div className="settings-divider-header">
                        PRIVACY / SECURITY
                    </div>

                    <div className="settings-card">
                        <div className="settings-row">
                            <div className="settings-leftRow">
{/*  LOC SERV   */}
                                <div className="settings-rowTitle">
                                    LOCATION SERVICES
                                </div>
                                    <div className="settings-rowSubtitle">
                                        Allow AI-Homework Helper to use location services
                                    </div>
                                </div>

                                <div className="settings-rightRow">
                                    <label className="settings-toggle">
                                       <input type="checkbox" />
                                       <span className="settings-slider"></span>
                                    </label>
                                </div>
                            </div>
{/*  PRIVACY   */}
                        <div className="settings-row">
                            <div className="settings-leftRow">
                                <div className="settings-rowTitle">
                                    PRIVACY POLICY
                                </div>
                                <div className="settings-rowSubtitle">
                                    View Team 43's Data Handling Policy
                                </div>
                            </div>
                        </div>
{/*  TOS   */}
                        <div className="settings-row">
                            <div className="settings-leftRow">
                                <div className="settings-rowTitle">
                                    TERMS OF SERVICE
                                </div>
                                <div className="settings-rowSubtitle">
                                    View & Read the Terms and Conditions
                                </div>
                            </div>
                        </div>

                        </div>
                </section>




{/*  SUPPORT   */}

                <section className="settings-divider">
                    <div className="settings-divider-header">
                        SUPPORT
                    </div>

                    <div className="settings-card">
                        <div className="settings-row">
                            <div className="settings-leftRow">

                                <div className="settings-rowTitle">
                                    HELP & FAQ
                                </div>
                                    <div className="settings-rowSubtitle">
                                       View/Read Commonly Asked Questions
                                    </div>
                                </div>

                            </div>
{/*  CONTACT   */}
                        <div className="settings-row">
                            <div className="settings-leftRow">
                                <div className="settings-rowTitle">
                                    CONTACT US
                                </div>
                                <div className="settings-rowSubtitle">
                                    Reach Out With Concerns & Comments
                                </div>
                            </div>
                        </div>
{/*  REPORT BUG   */}
                        <div className="settings-row">
                            <div className="settings-leftRow">
                                <div className="settings-rowTitle">
                                    REPORT A BUG
                                </div>
                                <div className="settings-rowSubtitle">
                                    Let us Know if You Encounter an Issue
                                </div>
                            </div>
                        </div>

                        </div>
                </section>

{/*  ABOUT   */}
                <section className="settings-divider">
                    <div className="settings-divider-header">
                        ABOUT
                    </div>

                    <div className="settings-card">
                        <div className="settings-row">
                            <div className="settings-leftRow">

                                <div className="settings-rowTitle">
                                    VERSION
                                </div>
                                    <div className="settings-rowSubtitle">
                                        View Current Version & Recent Patch Notes
                                    </div>
                                </div>

                                <div className="settings-rightRow">
                                    <span className="settings-rowID">
                                        1.X.X
                                    </span>
                                </div>
                            </div>

{/*  RATE APP   */}
                            <div className="settings-row">
                                <div className="settings-leftRow">
                                    <div className="settings-rowTitle">
                                        RATE THE APP
                                    </div>
                                    <div className="settings-rowSubtitle">
                                        Share Your Feedback With Us!
                                    </div>
                
                                </div>
                        </div>
                </div>
            </section>

{/*  LOGOUT   */}

            <section className="settings-divider">
                <div className="settings-card">
                    <div className="settings-logoutTitle">
                        ACCOUNT ACTIONS
                    </div>
                    <div className="settings-logoutSubtitle">
                        Log Out of Current Session
                    </div>
                </div>
            </section>
        </div>
        </div>
        </div>

    )





}