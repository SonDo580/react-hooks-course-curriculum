import React, { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { formatDate } from "../utils/helpers";
import ThemeContext from "../contexts/theme";

export default function PostMetaInfo({ by, time, id, descendants }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`meta-info-${theme}`}>
      <span>
        by <Link to={`/user?id=${by}`}>{by}</Link>
      </span>
      <span>on {formatDate(time)}</span>
      {typeof descendants === "number" && (
        <span>
          with <Link to={`/post?id=${id}`}>{descendants}</Link> comments
        </span>
      )}
    </div>
  );
}

PostMetaInfo.propTypes = {
  by: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  descendants: PropTypes.number,
};
