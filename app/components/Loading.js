import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const style = {
  fontSize: "35px",
  position: "absolute",
  left: "0",
  right: "0",
  marginTop: "20px",
  textAlign: "center",
};

export default function Loading({ text = "Loading", speed = 500 }) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const id = setInterval(() => {
      setContent((content) =>
        content === text + "..." ? text : content + "."
      );
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return <p style={style}>{content}</p>;
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};
