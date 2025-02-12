import React, { useState } from "react";
import backImg from '../Asset/Images/backimg.jpeg';
import logo from '../Asset/Images/logo.jpeg';
import '../pages/main.css'
import { SignInPage } from "@toolpad/core/SignInPage";
import type { Session } from "@toolpad/core/AppProvider";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { SIGN_IN } from "../lib/graphql/queries/auth";
import useGql from "../lib/graphql/gql";

const fakeAsyncGetSession = async (email, password) => {
    try {
        const data = await useGql({
            query: SIGN_IN,
            queryName: "signIn",
            queryType: "query-without-edge",
            variables: {
                input: {
                    userName: email,
                    password: password,
                },
            },
        });

        if (!data || !data.user) {
            throw new Error("Invalid credentials.");
        }

        return {
            user: {
                name: data.user.name,
                email: data.user.email,
                image: data.user.image || "https://avatars.githubusercontent.com/u/19550456",
            },
        };
    } catch (error) {
        throw new Error("Login failed. Please check your credentials.");
    }
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


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const session = await fakeAsyncGetSession(email, password);
            if (session) {
                setSession(session);
                navigate("/", { replace: true });
            }
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="login_main_d">
            <div className="img_div">
                <img src={backImg} alt="" style={{ width: "100%", height: 'auto' }} />
            </div>
            <div className="logo_d">
                <img src={logo} alt="" style={{ width: "100%", height: '100%' }} />
            </div>
            <div className="form_div">

                <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Log-in" />
                        <Tab label="Sign-up" />
                    </Tabs>

                    <TabPanel value={value} index={0}>
                        <form onSubmit={handleSubmit} className="form_loginn">
                            <div className="mb-4">
                                {/* <label className="block text-gray-700">Email:</label> */}
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div className="mb-4">
                                {/* <label className="block text-gray-700">Password:</label> */}
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded"
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Sign In
                            </button>
                        </form>

                    </TabPanel>
                    <TabPanel value={value} index={1}>This is the Profile Page</TabPanel>
                </Box>
            </div>
        </div>
    );
}
