import React, { useState } from "react";
import backImg from '../Asset/Images/backimg.jpg';
import logo from '../Asset/Images/logo.jpeg';
import '../pages/main.css'
import { SignInPage } from "@toolpad/core/SignInPage";
import type { Session } from "@toolpad/core/AppProvider";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { Tabs, Tab, Box, Typography } from "@mui/material";

const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (formData.get("password") === "password") {
                resolve({
                    user: {
                        name: "Bharat Kashyap",
                        email: formData.get("email") || "",
                        image: "https://avatars.githubusercontent.com/u/19550456",
                    },
                });
            }
            reject(new Error("Incorrect credentials."));
        }, 1000);
    });
};
const TabPanel = ({ children, value, index }) => {
    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};
export default function Login() {
    const [activeTab, setActiveTab] = useState("signup");
    const { setSession } = useSession();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="login_main_d">
            <div className="img_div">
                <img src={backImg} alt="" style={{ width: "100%", height: 'auto' }} />
            </div>
            <div className="logo_d">
                <img src={logo} alt="" style={{ width: "100%", height: 'auto' }} />
            </div>
            <div className="form_div">

                <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Log-in" />
                        <Tab label="Sign-up" />
                     </Tabs>

                    <TabPanel value={value} index={0}>Welcome to Home</TabPanel>
                    <TabPanel value={value} index={1}>This is the Profile Page</TabPanel>
                 </Box>
            </div>
        </div>
    );
}
