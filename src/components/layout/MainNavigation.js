import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>CQ Technologies</div>
      <nav>
        <ul>
          <li>
            <Link to="/">All Students</Link>
          </li>
          <li>
            <Link to="/book">All Books</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
