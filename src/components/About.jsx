import React from 'react';
import styles from './about.module.css';
import { FaGamepad, FaPlay, FaFilm, FaUsers, FaHeart, FaRocket } from 'react-icons/fa';
import Sidebarr from './Sidebarr';
import { useLocation } from 'react-router-dom';

const About = () => {
  const location = useLocation();

  // Create menu items with active state based on current location
  const createMenuItems = () => {
    return [
      { label: "Home", icon: "FaHome", href: "/", active: location.pathname === "/" },
      { label: "Profile", icon: "FaUser", href: "/profile", active: location.pathname === "/profile" },
      { label: "About AMG Retro", icon: "FaChartBar", href: "/about", active: location.pathname === "/about" },
      // { label: "Messages", icon: "FaEnvelope", href: "/messages", active: location.pathname === "/messages" },
      // { label: "Resources", icon: "FaFlask", href: "/settings", active: location.pathname === "/settings" },
    ];
  };

  return (
    <div className={styles.aboutContain}>
    <Sidebarr menuItems={createMenuItems()} />
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.highlight}>AMG Retro</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your ultimate destination for the latest updates, reviews, and discussions on Games, Anime, and Movies
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className={styles.missionSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            At AMG Retro, we're passionate about bringing you the most comprehensive and up-to-date information 
            about your favorite entertainment mediums. Whether you're a hardcore gamer, anime enthusiast, or movie buff, 
            we've got you covered with the latest news, reviews, and community discussions.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className={styles.categoriesSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What We Cover</h2>
          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <FaGamepad />
              </div>
              <h3 className={styles.categoryTitle}>Games</h3>
              <p className={styles.categoryDescription}>
                Stay updated with the latest gaming news, reviews, and releases. From AAA titles to indie gems, 
                we cover all platforms and genres.
              </p>
              <ul className={styles.categoryFeatures}>
                <li>Latest Game Releases</li>
                <li>Gaming Reviews & Ratings</li>
                <li>Gaming Industry News</li>
                <li>Esports Updates</li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <FaPlay />
              </div>
              <h3 className={styles.categoryTitle}>Anime</h3>
              <p className={styles.categoryDescription}>
                Dive into the world of anime with seasonal updates, reviews, and discussions about your favorite shows and characters.
              </p>
              <ul className={styles.categoryFeatures}>
                <li>Seasonal Anime Reviews</li>
                <li>Anime Recommendations</li>
                <li>Character Analysis</li>
                <li>Manga Adaptations</li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <FaFilm />
              </div>
              <h3 className={styles.categoryTitle}>Movies</h3>
              <p className={styles.categoryDescription}>
                Get the latest movie reviews, box office updates, and behind-the-scenes insights from Hollywood and beyond.
              </p>
              <ul className={styles.categoryFeatures}>
                <li>Movie Reviews & Ratings</li>
                <li>Box Office Reports</li>
                <li>Trailer Analysis</li>
                <li>Industry Insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Why Choose AMG Retro?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaUsers />
              </div>
              <h3 className={styles.featureTitle}>Community Driven</h3>
              <p className={styles.featureDescription}>
                Join our vibrant community of entertainment enthusiasts. Share your thoughts, 
                discover new content, and connect with like-minded fans.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaRocket />
              </div>
              <h3 className={styles.featureTitle}>Real-time Updates</h3>
              <p className={styles.featureDescription}>
                Get instant notifications about the latest releases, breaking news, and trending topics 
                in the gaming, anime, and movie worlds.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaHeart />
              </div>
              <h3 className={styles.featureTitle}>Personalized Experience</h3>
              <p className={styles.featureDescription}>
                Customize your feed based on your interests. Follow your favorite categories and creators 
                for a tailored entertainment experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className={styles.teamSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <p className={styles.teamDescription}>
            Our passionate team of writers, reviewers, and content creators work tirelessly to bring you 
            the best entertainment content from around the world.
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <img src="/api/profileimages/default-avatar.png" alt="Team Member" />
              </div>
              <h3 className={styles.memberName}>Gaming Expert</h3>
              <p className={styles.memberRole}>Lead Game Reviewer</p>
              <p className={styles.memberBio}>
                Passionate about all things gaming, from retro classics to cutting-edge VR experiences.
              </p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <img src="/api/profileimages/default-avatar.png" alt="Team Member" />
              </div>
              <h3 className={styles.memberName}>Anime Specialist</h3>
              <p className={styles.memberRole}>Anime Content Creator</p>
              <p className={styles.memberBio}>
                Dedicated to exploring the vast world of anime and sharing hidden gems with our community.
              </p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <img src="/api/profileimages/default-avatar.png" alt="Team Member" />
              </div>
              <h3 className={styles.memberName}>Movie Critic</h3>
              <p className={styles.memberRole}>Film Analyst</p>
              <p className={styles.memberBio}>
                Bringing cinematic insights and thoughtful analysis to every movie review and discussion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className={styles.contactSection}>
        <div className={styles.sectionContent}>
          <h2 style={{color: "white"}} className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.contactDescription}>
            Have suggestions, feedback, or want to contribute? We'd love to hear from you!
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>contact@amgretro.com</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Follow Us</h3>
              <p>@AMGRetro on social media</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Join Our Community</h3>
              <p>Create an account and start sharing!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;
