import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import Users from "../Users";
import UserDetails from "../UserDetails";

const Main = () => {
    const [data, setData] = useState(null);
    const [showUsers, setShowUsers] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleGetUsers = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
                const { data: res } = await axios(config);
                setData(res.data);
                setShowUsers(true);
                setResponseMessage(res.message || "");
            } catch (error) {
                handleErrorResponse(error);
            }
        }
    };

    const handleUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users/me',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
                const { data: res } = await axios(config);
                setData([res.data]);
                setShowUsers(false);
                setResponseMessage(res.message || "");
            } catch (error) {
                handleErrorResponse(error);
            }
        }
    };

    const handleDeleteUser = async () => {
        const confirmed = window.confirm("Are you sure you want to delete your account?");
        if (confirmed) {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const config = {
                        method: 'delete',
                        url: 'http://localhost:8080/api/users/me',
                        headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                    };
                    const { data: res } = await axios(config);
                    setResponseMessage(res.message || "");
                    handleLogout();
                } catch (error) {
                    handleErrorResponse(error);
                }
            }
        }
    };

    const handleErrorResponse = (error) => {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            localStorage.removeItem("token");
            window.location.reload();
        }
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>MySite</h1>
                <button className={styles.white_btn} onClick={handleGetUsers}>
                    Users
                </button>
                <button className={styles.white_btn} onClick={handleUserDetails}>
                    Account details
                </button>
                <button className={styles.white_btn} onClick={handleDeleteUser}>
                    Delete account
                </button>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            {responseMessage && <h2>{responseMessage}</h2>}
            {data !== null && (showUsers ? <Users users={data} /> : <UserDetails user={data[0]} />)}
        </div>
    );
};

export default Main;
