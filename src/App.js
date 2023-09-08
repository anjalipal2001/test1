
import React, { useState } from 'react';
import './App.css';
import AddReview from './components/AddReview/AddReview.js';


function App() {
   const [reviews, setReviews] = useState([]);

  const handleAddReview = (reviewText) => {
      const newReview = {
        text: reviewText,
        date: new Date().toLocaleString(),
        votes: 0,
      };
      setReviews([...reviews, newReview]);
    };

    return (
      <div className="App">
        <h1>Movie Review Web App</h1>
        <AddReview onAddReview={handleAddReview} />
  
      </div>
    );
  }

  export default App;


