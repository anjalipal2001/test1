import React, { useState } from 'react';
import axios from 'axios';
import ReviewList from '../ReviewList/ReviewList';
import './AddReview.css';
function AddReview({ onAddReview }) {
  const [reviewText, setReviewText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewList, setReviewList] = useState([]);

  const handleAddReviewClick = () => {
    setIsAddingReview(true);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

 
  const handleAnalyzeClick = async () => {
    try {
      // Check if the reviewText is not empty
      if (reviewText.trim() !== '') {
        const apiKey = '5EG5W8i9TOAx71d6HMQEeW0UQDFwkInr9oR6dxOK'; 
        const apiUrl = 'https://api.cohere.ai/classify'; 
     
        const requestData = {
          truncate: 'END',
         inputs: [reviewText], 
        
          examples: [
            { text: '“This film stands out in today cinema landscape. Every scene is thoughtfully crafted, and thecharacters have depth and nuance. The story flows naturally, keeping viewers engaged. Itahigh point in recent movie releases.', label: 'positive review' },
            { text: '“While the movie had its moments, it failed to leave a lasting impression. The cast did their job,but the script lacked depth. The music was fitting but forgettable. Overall, an average experience.”', label: 'neutral review' }, // Updated label to 'neutral review'
            { text: 'I ordered more for my friends', label: 'positive review' },
            { text: 'I would buy this again', label: 'positive review' },
            { text: 'I would recommend this to others', label: 'neutral review' },
            { text: 'The package was damaged', label: 'negative review' },
            { text: 'The order is 5 days late', label: 'neutral review' },
            { text: 'The order was incorrect', label: 'negative review' },
            { text: '“The movie starts with promise but soon disappoints. It drags at times, and some dialogues feel forced. Despite a talented cast, the script doesnt do them justice. ”', label: 'negative review' },
         
          ],
        };
  
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        };
  
        const response = await axios.post(apiUrl, requestData, { headers });
  
        if (response.status === 200) {
          const data = response.data;
       
          const predictions = data.classifications.map(classification => ({
            input: classification.input,
            prediction: classification.prediction,
            confidence: classification.confidence,
          }));
 
           // Now you have an array of predictions for each input
        console.log("Predictions:", predictions);

        // Determine the sentiment result based on the highest confidence prediction
        const highestConfidencePrediction = predictions.reduce((prev, current) =>
          prev.confidence > current.confidence ? prev : current
        );

        // Set the sentiment result to the highest confidence prediction
        setSentimentResult(highestConfidencePrediction.prediction);

        const analyzedReview = {
          reviewText: reviewText,
          sentiment: highestConfidencePrediction.prediction,
          dateTime: new Date().toLocaleString(),
          votes: 0,
        };

        setReviewList([...reviewList, analyzedReview]);

        } else {
          // Handle error
          console.error('Error analyzing sentiment:', response.status);
        }
      } else {
        // Handle the case where the input is empty
        console.error('Input text is empty.');
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('An error occurred:', error);
    }
  };
  
    // Function to handle upvote
  const handleUpvote = (index) => {
    console.log(`Upvoting review at index ${index}`);
      setReviewList((prevReviewList) =>
        prevReviewList.map((review, i) =>
          i === index ? { ...review, votes: review.votes + 1 } : review
        )
      );
    };
    // Function to handle downvote
  const handleDownvote = (index) => {

      setReviewList((prevReviewList) =>
        prevReviewList.map((review, i) =>
          i === index ? { ...review, votes: review.votes - 1 } : review
        )
      );
    };

  // Sort reviews by votes in descending order
  const sortedReviews = [...reviewList].sort((a, b) => b.votes - a.votes);

  return (
    <div >

      <div className="add-review-container">
      {!isAddingReview && (
        <button onClick={handleAddReviewClick}>Add Review</button>
        )}
      {isAddingReview && (
        <div>

          <textarea
            placeholder="Write your review here..."
            value={reviewText}
            onChange={handleReviewTextChange}
          ></textarea>
          <button onClick={handleAnalyzeClick}>Analyze</button>
        </div>
        )}
      </div>
      <div className="sentiment">
      {/* Display sentiment result */}
      {sentimentResult !== null && (
        <div className="sentiment-result">
          <p>Sentiment: {sentimentResult}</p>
        </div>
        )}
        </div>
      {/* Display the table of analyzed reviews */}
      {sortedReviews.length > 0 && (
        <ReviewList
          sortedReviews={sortedReviews}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
        />
      )}
    
  
    </div>
  );

}

export default AddReview;





