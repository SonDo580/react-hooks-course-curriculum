import React, { useEffect, useReducer } from "react";
import queryString from "query-string";

import { fetchItem, fetchComments } from "../utils/api";

import Loading from "./Loading";
import PostMetaInfo from "./PostMetaInfo";
import Title from "./Title";
import Comment from "./Comment";

const initialState = {
  post: null,
  loadingPost: true,
  comments: null,
  loadingComments: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_PENDING":
      return initialState;

    case "FETCH_POST_SUCCESS":
      return {
        ...state,
        error: null,
        loadingPost: false,
        post: action.post,
      };

    case "FETCH_COMMENTS_SUCCESS":
      return {
        ...state,
        error: null,
        loadingComments: false,
        comments: action.comments,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        error: action.error,
        loadingPost: false,
        loadingComments: false,
      };

    default:
      return state;
  }
}

export default function Post() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_PENDING" });

    const { id } = queryString.parse(location.search);

    fetchItem(id)
      .then((post) => {
        dispatch({ type: "FETCH_POST_SUCCESS", post });

        return fetchComments(post.kids || []);
      })
      .then((comments) =>
        dispatch({ type: "FETCH_COMMENTS_SUCCESS", comments })
      )
      .catch(({ message }) =>
        dispatch({ type: "FETCH_ERROR", error: message })
      );
  }, []);

  const { post, loadingPost, comments, loadingComments, error } = state;

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <>
      {loadingPost === true ? (
        <Loading text="Fetching post" />
      ) : (
        <>
          <h1 className="header">
            <Title url={post.url} title={post.title} id={post.id} />
          </h1>
          <PostMetaInfo
            by={post.by}
            time={post.time}
            id={post.id}
            descendants={post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: post.text }} />
        </>
      )}
      {loadingComments === true ? (
        loadingPost === false && <Loading text="Fetching comments" />
      ) : (
        <>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </>
      )}
    </>
  );
}
