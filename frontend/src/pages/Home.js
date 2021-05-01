import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import Post from "../components/Post";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
