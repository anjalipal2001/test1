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
            { text: 'This film stands out in todays cinema landscape. Every scene is thoughtfully crafted, and the characters have depth and nuance. The story flows naturally, keeping viewers engaged. It ahigh point in recent movie releases', label: 'positive review' },
            { text: `The film wields a powerful narrative, fused with a humor that both organic and poignant. Our
            protagonist's journey is a tapestry of emotive beats, matched by an equally evocative score. The
            performances here aren't merely acted; they're lived. This is cinema in its most resonant form.`, label: 'positive review' }, // Updated label to 'neutral review'
            { text: `This film is a breath of fresh air. Beautifully shot scenes and a compelling storyline make it a
            standout. The cast's chemistry is palpable, driving the narrative forward with ease. A delightful
            cinematic experience from start to finish.`, label: 'positive review'
              },
            
            { text: `A captivating blend of drama and wit. The director's vision shines through every frame,
            complemented by a pitch-perfect score. Performances are top-notch, drawing viewers into the
            heart of the story. It's a film that lingers long after the credits roll.`, label: 'positive review'
              },
            
            { text: `While the movie had its moments, it failed to leave a lasting impression. The cast did their job,
            but the script lacked depth. The music was fitting but forgettable. Overall, an average
            experience.`, label: 'neutral review' },
            { text: `There are moments of brilliance, but they're spread thin. Some themes resonate, but the
            delivery isn't always there. The music fits but isn't standout. It's a mixed bag overall.`, label: 'neutral review' },
            { text: `The movie is competently made, with moments that genuinely shine. However, the story often
            treads familiar territory, making it predictable at times. While the actors put forth solid
            performances, the script limits their potential. An even mix of highs and lows.`, label: 'neutral review' },
            { text: `It's a film that has its moments but fails to fully captivate. The visual appeal is there, but the
            emotional depth is inconsistent. Some scenes are beautifully executed, while others fall flat. A
            decent watch but not groundbreaking.`, label: 'neutral review' },
            { text: `The movie starts with promise but soon disappoints. It drags at times, and some dialogues feel
            forced. Despite a talented cast, the script doesn't do them justice. It's a forgettable outing.`, label: 'negative review'
              },
            
              { text: `The film, regrettably, buckles under the weight of its own aspirations. Amidst its sprawling
              narrative, the essence is lost, characters relegated to mere shadows. Even its cinematographic
              choices, while occasionally inspired, largely feel derivative. A cinematic journey that promises
              much but delivers little.`, label: 'negative review'
              },
              { text: `Despite its potential, the film doesn't quite hit the mark. The narrative feels disjointed, often
              losing its momentum. While there are a few standout performances, they're overshadowed by a
              lackluster script. A missed opportunity in storytelling.`, label: 'negative review'
              },
              { text: `The movie offers a premise filled with promise but struggles in its execution. Pacing issues
              detract from key moments, and character development is lacking. While it boasts some
              well-composed shots, they're not enough to lift the overall experience. A film that's less than the
              sum of its parts.`, label: 'negative review'
                },
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
   
      setReviewList((prevReviewList) =>
        prevReviewList.map((review, i) =>
          i === index ? { ...review, votes: review.votes + 1 } : review
        )
      );
    };
    // Function to handle downvote
 
  const handleDownvote = (index) => {
    setReviewList((prevReviewList) =>
      prevReviewList.map((review, i) => {
        if (i === index) {
          // Check if votes are greater than 0 before decrementing
          const newVotes = review.votes > 0 ? review.votes - 1 : 0;
          return { ...review, votes: newVotes };
        }
        return review;
      })
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





