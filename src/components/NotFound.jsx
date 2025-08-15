import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import styles from "./notfound.module.css";
import errorRobotGif from "../assets/error-robot.gif";
import errorGlitchGif from "../assets/error-glitch.gif";
import confusedCatGif from "../assets/confused-cat.gif";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.decorativeElements}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <img 
          src={errorRobotGif} 
          alt="Error robot animation" 
          className={styles.mainGif}
        />
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>
        <div className={styles.gifContainer}>
          <img 
            src={errorGlitchGif} 
            alt="Glitch effect animation" 
            className={styles.gif}
          />
          <img 
            src={confusedCatGif} 
            alt="Confused cat animation" 
            className={styles.gif}
          />
        </div>
        <a href="/" className={styles.homeButton}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;