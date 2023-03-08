import { useEffect, useState } from "react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StarsRating from "react-star-rate";
import Loading from "../../Loading/Loading";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { toast } from "react-toastify";
import { getServiceDetail } from "../../../redux/actions/servicesActions";
import { NavBarUser } from "../../index.js";
import "../Orders/reviewService.css";

export default function ReviewService() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const service = useSelector((state) => state.services.serviceDetail);
  const userID = useSelector((state) => state.users.userID);
  const userEmail = useSelector((state) => state.users.email);
  const userEmail1 = userEmail.slice(0, -10);
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    dispatch(getServiceDetail(id));
  }, [dispatch, id]);

  const submitReview = (e) => {
    e.preventDefault();
    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      userID,
      userEmail1,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review submitted successfully");
      setRate(0);
      setReview("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fondoRev">
      <NavBarUser />
      <div className="reviewService">
        <Link to={`/profile/orders`}>
          <button className="backRev">Back</button>
        </Link>

        <div className="boxRev">
          <br />
          <h2 className="h2Rev">Review Products</h2>
          <br />
          {service === null ? (
            <Loading />
          ) : (
            <div className="revName">
              <p>
                <b>Product name:</b> {service.servicename}
              </p>
              <img
                src={service["Users.profilepic"]}
                alt={service.name}
                style={{ width: "200px" }}
              />
            </div>
          )}
          <form onSubmit={(e) => submitReview(e)}>
            <div className="stars">
              <label className="ratinRev">Rating:</label>
            <StarsRating
              value={rate}
              onChange={(rate) => {
                setRate(rate);
              }}
            />
            </div>
          <div className="revArea">
            <label className="revRev">Write your review:</label>
            <textarea
              className="textareaRev"
              value={review}
              required
              onChange={(e) => setReview(e.target.value)}
              cols="80"
              rows="10"
            >
            </textarea>
          </div>
            
            <button type="submit" className="subRev">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
