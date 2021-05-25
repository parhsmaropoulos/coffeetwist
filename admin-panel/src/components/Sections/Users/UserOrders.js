import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { update_order } from "../../../actions/orders";
import { getUser } from "../../../actions/user";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Grid, Container } from "@material-ui/core";

class UserOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: {},
      comment: "",
      comment_order_ids: [],
      rating: 4,
      showCommentModal: false,
    };
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    update_order: PropTypes.func.isRequired,
  };

  showCommentModal = (bool, order) => {
    this.setState({
      showCommentModal: !this.state.showCommentModal,
      selectedOrder: order,
    });
  };

  commentOrder = () => {
    let data = {
      order_id: this.state.selectedOrder.id,
      reason: "comment_order",
      comment_text: this.state.comment,
      user_name: this.props.userReducer.user.name,
      rating: {
        rate: parseFloat(this.state.rating),
        user_id: this.props.userReducer.user.id,
      },
    };
    this.props.update_order(data);
    console.log(this.state);
  };

  componentDidMount() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    }
    let comment_ids = [];
    for (var i in this.props.userReducer.user.comments) {
      comment_ids.push(this.props.userReducer.user.comments[i].order_id);
    }
    this.setState({ comment_order_ids: comment_ids });
  }

  onChange = (e) => {
    // console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let authenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ? true : false;
    let commentModal;
    if (this.state.showCommentModal)
      commentModal = (
        <Modal
          show={true}
          autoFocus={true}
          onHide={(e) => {
            this.showCommentModal(false, null);
          }}
          id="alertModal"
        >
          <Modal.Header className="commentModalHeader">
            <Button
              variant="secondary"
              onClick={(e) => {
                this.showCommentModal(false, null);
              }}
            >
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="commentModalBodyDiv">
              <Row className="centered">
                <div>
                  <Typography component="legend">
                    Enter your comment!
                  </Typography>
                  <textarea
                    name="comment"
                    type="textarea"
                    value={this.state.comment}
                    placeholder="Great job.."
                    cols="40"
                    onChange={(e) => this.onChange(e)}
                  />
                </div>
              </Row>
              <Row className="centered">
                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Leave a rating!</Typography>
                  <Rating
                    name="rating"
                    defaultValue={4}
                    precision={0.5}
                    onChange={(e) => this.onChange(e)}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                </Box>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.commentOrder()}>Submit</Button>
          </Modal.Footer>
        </Modal>
      );
    if (authenticated === false) {
      return <Redirect to="/home" />;
    }
    if (authenticated === true && this.props.userReducer.hasLoaded === false) {
      this.props.getUser(sessionStorage.getItem("userID"));
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    } else {
      return (
        <Container className="accountMainPage">
          <Grid spacing={3} container>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text" to="/account">
                Ο λογαριασμός μου
              </Link>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link
                className="nav-text  nav-text-activated"
                to="/account/orders"
              >
                Οι παραγγελίες μου
              </Link>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/addresses">
                Διευθύνσεις
              </Link>
            </Grid>

            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid>
          </Grid>
          <Col className="userOrdersCol bodyCol">
            <div className="roundedContainer">
              <div className="userOrdersColHeader">
                <div className="title">Οι παραγγελίες σου</div>
                <span></span>
              </div>
              <div className="userOrdersColBody">
                {this.props.userReducer.user.orders.length > 0 ? (
                  <div>
                    {this.props.userReducer.user.orders.map((order, index) => {
                      // console.log(order);
                      var date = new Date(order.create_at);
                      return (
                        <Row className="orderRow" key={index}>
                          <Col className="orderRowCol dateCol">
                            {date.getDate()}-{date.getMonth() + 1}-
                            {date.getFullYear()}
                          </Col>
                          <Col className="orderRowCol prodsCol">
                            <ul>
                              {order.products.map((product, index) => {
                                return (
                                  <li key={index}>
                                    <span className="listItemTitle">
                                      x {product.quantity} {product.item.name}
                                    </span>
                                    <br />{" "}
                                    <span className="listItemSubTitle">
                                      {product.optionAnswers.join() +
                                        `,${product.comment}`}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </Col>
                          <Col className="orderRowCol optionsCol">
                            {/* {console.log(this.state.comment_order_ids)}
                            {console.log(order.id)} */}
                            {this.state.comment_order_ids.includes(order.id) ? (
                              <span>
                                {/* Comment:{" "}
                                {
                                  this.props.userReducer.user.comments[order.id]
                                    .comment_text
                                }
                                , Rate:{" "}
                                {
                                  this.props.userReducer.user.comments[order.id]
                                    .rate
                                } */}
                                Commented
                              </span>
                            ) : (
                              <button
                                className="commentButton"
                                onClick={() =>
                                  this.showCommentModal(false, order)
                                }
                              >
                                Comment!
                              </button>
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                ) : (
                  <div>Δεν εχεις ολοκληρώσει κάποια παραγγελία ακόμα</div>
                )}
              </div>
            </div>
          </Col>
          {commentModal}
        </Container>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, { update_order, getUser })(UserOrders);
