import React, { useEffect, useReducer } from "react";
import queryString from "query-string";

import { fetchUser, fetchPosts } from "../utils/api";
import { formatDate } from "../utils/helpers";

import Loading from "./Loading";
import PostsList from "./PostsList";

const initialState = {
  user: null,
  loadingUser: true,
  posts: null,
  loadingPosts: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_PENDING":
      return initialState;

    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        error: null,
        loadingUser: false,
        user: action.user,
      };

    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        error: null,
        loadingPosts: false,
        posts: action.posts,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        error: action.error,
        loadingUser: false,
        loadingPosts: false,
      };

    default:
      return state;
  }
}

export default function User({ location }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_PENDING" });

    const { id } = queryString.parse(location.search);

    fetchUser(id)
      .then((user) => {
        dispatch({ type: "FETCH_USER_SUCCESS", user });

        return fetchPosts(user.submitted.slice(0, 30));
      })
      .then((posts) => dispatch({ type: "FETCH_POSTS_SUCCESS", posts }))
      .catch(({ message }) =>
        dispatch({ type: "FETCH_ERROR", error: message })
      );
  }, []);

  const { user, posts, loadingUser, loadingPosts, error } = state;

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <>
      {loadingUser ? (
        <Loading text="Fetching User" />
      ) : (
        <>
          <h1 className="header">{user.id}</h1>
          <div className="meta-info-light">
            <span>
              joined <b>{formatDate(user.created)}</b>
            </span>
            <span>
              has <b>{user.karma.toLocaleString()}</b> karma
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: user.about }} />
        </>
      )}
      {loadingPosts ? (
        !loadingUser && <Loading text="Fetching posts" />
      ) : (
        <>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </>
      )}
    </>
  );
}
