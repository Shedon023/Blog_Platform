import { Button, Typography, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className={styles.headerContainer}>
      <Typography className={styles.headerName} component={Link} to={"/"}>
        Realworld Blog
      </Typography>
      <div className={styles.headerButtons}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <Button variant="outlined" color="success" size="small" component={Link} to={"/newArticle"}>
                Create article
              </Button>
              <Typography variant="body1" className={styles.userName} component={Link} to={`/editProfile`}>
                {user.username}
              </Typography>
              <Avatar src={user.image || ""} alt={user.username} component={Link} to={`/editProfile`} />
            </div>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="text" component={Link} to="/sign-in">
              Sign in
            </Button>
            <Button variant="outlined" color="success" component={Link} to="/sign-up">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
