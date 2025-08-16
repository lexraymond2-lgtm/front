import { useState, useEffect } from "react";
import styles from "./lns.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  let navigate = useNavigate();
  let [ucredentials, setUcredentials] = useState({
    phone: "",
    password: "",
  });

  let [disabled, setDisabled] = useState(true);

  function handleChange(e) {
    e.preventDefault();
    setUcredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (ucredentials.phone == "" || ucredentials.password == "") {
      return;
    } else {
      document.querySelector("#subbtn").classList.remove(styles.is_disabled);
      setDisabled(false);
    }
  }

  async function fetchData() {
    try {
      let res = await axios.post("http://localhost:3000/login", ucredentials);

      if (res.status === 200) {
        if (res.data.message === "User logged in successfully") {
          console.log("Login successful:", res.data);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          let token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          navigate("/");
        }
      }

      console.log("Response from server:", res);
    } catch (err) {
      console.log("Error during login:", err);
      if (err.response.data.errs) {
        let errors = err.response.data.errs;
        errors.forEach((error) => {
          if (error.path.includes("phone")) {
            document.querySelector("#erphone").innerText = error.message;
            document.querySelector("#termi").innerText = error.message;
          } else {
            document.querySelector("#erphone").innerText = "";
          }

          if (error.path.includes("password")) {
            document.querySelector("#termi").innerText = error.message;
            document.querySelector("#erpass").innerText = error.message;
          } else {
            document.querySelector("#erpass").innerText = "";
          }
        });
      }

      if (err.response.data.message === "User not found") {
        document.querySelector("#erphone").innerText = "User not found";
        document.querySelector("#termi").innerText = "User not found";
      } else {
        document.querySelector("#erphone").innerText = "";
      }

      if (err.response.data.message === "Invalid password") {
        document.querySelector("#erpass").innerText = "Invalid password";
        document.querySelector("#termi").innerText = "Invalid password";
      } else {
        document.querySelector("#erpass").innerText = "";
      }
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.innercontainer}>
          <div className={styles.machine}>
            <div className={styles.containerr}>
              <div className={styles.container_terminal}></div>
              <div className={styles.terminal_toolbar}>
                <div className={styles.butt}>
                  <button
                    className={`${styles.btncolor} ${styles.btn}`}
                  ></button>
                  <button className={styles.btn}></button>
                  <button className={styles.btn}></button>
                </div>
                <p className={styles.user}>retro@admin: ~</p>
              </div>
              <div className={styles.terminal_body}>
                <div className={styles.terminal_promt}>
                  <span className={styles.terminal_user}>retro@admin:</span>
                  <span className={styles.terminal_location}>~</span>
                  <span className={styles.terminal_bling}>$</span>
                  <span id="termi" className={styles.terminal_user}></span>
                  <span className={styles.terminal_cursor}></span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.form}>
            <div className={styles.machine}></div>
            <div className={styles.toplog}>
              <Link
                to="/signup"
                style={{
                  marginRight: "20px",
                }}
                className={styles.title}
              >
                Sign Up
              </Link>
              <Link
                to="/Login"
                style={{
                  borderBottom: "5px solid  rgb(219, 20, 153)",
                  paddingBottom: "2px",
                  width: "150px",
                  textAlign: "center",
                  borderRadius: "5px",
                  marginLeft: "20px",
                }}
                className={styles.title}
              >
                Login
              </Link>
            </div>

            <p className={styles.custommessage}>
              If signing up brings you right back here, just log in __we've been
              expecting you.
            </p>

            <label className={styles.label}>
              <p id="erphone" className={styles.pe}></p>
              <input
                placeholder="Phone Number"
                type="text"
                name="phone"
                className={styles.input}
                onChange={handleChange}
              />
            </label>
            <label className={styles.label}>
              <p id="erpass" className={styles.pe}></p>
              <input
                placeholder=" Password"
                type="password"
                name="password"
                id="cpassword"
                className={`${styles.input} ${styles.passerr}`}
                onChange={handleChange}
              />
            </label>

            <button
              id="subbtn"
              disabled={disabled}
              onClick={fetchData}
              className={`${styles.button} ${styles.is_disabled}`}
            >
              Create New Account
            </button>
            <p className={styles.custommessage}>
              By creating an account, you agree to our{" "}
              <a href="#">Terms & Conditions</a> and confirm that you are at
              least 18 years old or over and all information given is true.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
