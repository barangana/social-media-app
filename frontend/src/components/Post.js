import moment from "moment";
import React from "react";
import { Card, Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Post({
  posts: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  function likePosts() {
    console.log("Liked the post");
  }

  function commentOnPost() {
    console.log("Commented on the post");
  }

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePosts}>
          <Button color="teal" basic>
            <Icon name="heart" />
          </Button>
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentOnPost}>
          <Button color="blue" basic>
            <Icon name="comment" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default Post;
