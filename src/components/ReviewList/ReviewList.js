
import React from 'react';

function ReviewList({ sortedReviews, handleUpvote, handleDownvote }) {
  return (
    <div className="review-table">
      <h2>Reviewed Texts</h2>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Review Text</th>
            <th>Sentiment</th>
            <th>Votes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedReviews.map((review, index) => (
            <tr key={index}>
              <td>{review.dateTime}</td>
              <td>{review.reviewText}</td>
              <td>{review.sentiment}</td>
              <td>{review.votes}</td>
              <td>
                <button className="up-button" onClick={() => handleUpvote(index)}>+</button>
               
                <button className="down-button"onClick={() => handleDownvote(index)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewList;

