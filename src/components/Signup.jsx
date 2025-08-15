import { useState, useEffect } from "react";
import styles from "./lns.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  let [ucredentials, setUcredentials] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  let [disabled, setDisabled] = useState(true);

  function handleChange(e) {
    e.preventDefault();
    setUcredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (
      ucredentials.username == "" ||
      ucredentials.phone == "" ||
      ucredentials.password == "" ||
      ucredentials.confirmPassword == ""
    ) {
      return;
    } else {
      document.querySelector("#subbtn").classList.remove(styles.is_disabled);
      setDisabled(false);
    }
  }

  async function fetchData() {
    try {
      let res = await axios.post("https://40cbf51fbb77.ngrok-free.app/signup", ucredentials);
      console.log(res);
      if (res.data) {
        if (res.data.message == "User Already Exist") {
          document.querySelector("#phoerr").innerText = "Phone Already Exits";
          document.querySelector("#termi").innerText = "Phone Already Exits";
        } else if ((res.data.message = "User signed up successfully")) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.response && err.response.data && err.response.data.errs) {
        let errors = err.response.data.errs;
        errors.forEach((error) => {
          console.log("Error:", error.path);
          if (error.path.includes("username")) {
            document.querySelector("#userr").innerText = error.message;
            document.querySelector("#termi").innerText = error.message;
          } else {
            document.querySelector("#userr").innerText = "";
          }
          if (error.path.includes("phone")) {
            document.querySelector("#phoerr").innerText = error.message;
            document.querySelector("#termi").innerText = error.message;
          } else {
            document.querySelector("#phoerr").innerText = "";
          }
          if (error.path.includes("password")) {
            document.querySelector("#passerr").innerText = error.message;
            document.querySelector("#termi").innerText = error.message;
          } else {
            document.querySelector("#passerr").innerText = "";
          }
          if (error.path.includes("confirmPassword")) {
            document.querySelector("#paserr").innerText = error.message;
            document.querySelector("#termi").innerText = error.message;
          } else {
            document.querySelector("#paserr").innerText = "";
          }
        });
      } else if (err.response.status == 500) {
        console.log("server Error");
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
            <div className={styles.toplog}>
              <Link
                to="/Signup"
                style={{
                  borderBottom: "5px solid  rgb(219, 20, 153)",
                  paddingBottom: "2px",
                  width: "150px",
                  textAlign: "center",
                  borderRadius: "5px",
                  marginRight: "20px",
                }}
                className={styles.title}
              >
                Sign Up
              </Link>
              <Link
                to="/Login"
                style={{
                  marginLeft: "20px",
                }}
                className={styles.title}
              >
                Login
              </Link>
            </div>

            <p className={styles.custommessage}></p>
            <label className={styles.label}>
              <p className={styles.pe} id="userr"></p>
              <input
                placeholder="Username"
                type="text"
                name="username"
                className={styles.input}
                onChange={handleChange}
              />
            </label>
            <label className={styles.label}>
              <p className={styles.pe} id="phoerr"></p>
              <input
                placeholder="Phone Number"
                type="text"
                name="phone"
                className={styles.input}
                onChange={handleChange}
              />
            </label>
            <label className={styles.label}>
              <p className={styles.pe} id="passerr"></p>
              <input
                placeholder=" Password"
                type="password"
                name="password"
                className={`${styles.input} ${styles.passerr}`}
                onChange={handleChange}
              />
            </label>
            <label className={styles.label}>
              <p className={styles.pe} id="paserr"></p>
              <input
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                id="cpassword"
                className={`${styles.input}`}
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

export default Signup;
