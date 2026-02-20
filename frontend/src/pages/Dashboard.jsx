import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.username);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Dashboard</h1>
      <h3>Welcome, {user}</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;