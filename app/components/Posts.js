import React, { useEffect, useReducer } from "react";
import PropTypes, { func } from "prop-types";

import { fetchMainPosts } from "../utils/api";

import Loading from "./Loading";
import PostsList from "./PostsList";

const initialState = {
  posts: null,
  error: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_PENDING":
      return initialState;

    case "FETCH_SUCCESS":
      return {
        posts: action.posts,
        loading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
}

export default function Posts({ type }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    handleFetch();
  }, [type]);

  const handleFetch = () => {
    dispatch({ type: "FETCH_PENDING" });

    fetchMainPosts(type)
      .then((posts) => dispatch({ type: "FETCH_SUCCESS", posts }))
      .catch(({ message }) =>
        dispatch({ type: "FETCH_ERROR", error: message })
      );
  };

  const { posts, error, loading } = state;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return <PostsList posts={posts} />;
}

Posts.propTypes = {
  type: PropTypes.oneOf(["top", "new"]),
};
