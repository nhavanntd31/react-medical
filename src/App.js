import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('images.json');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleRatingChange = (imageId, rating) => {
    setRatings({ ...ratings, [imageId]: rating });
  };

  const handleCommentChange = (imageId, comment) => {
    setComments({ ...comments, [imageId]: comment });
  };

  const handleSaveData = () => {
    const dataToSave = images.map((image) => ({
      ImageID: image.id,
      Rating: ratings[image.id] || '',
      Comment: comments[image.id] || '',
    }));

    const csvData = Papa.unparse({
      fields: ['ImageID', 'Rating', 'Comment'],
      data: dataToSave,
    });

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
const quality = [1,2,3,4,5]
  return (
    <div className="App">
      <h1>Image Rating App</h1>
      <div className="image-container">
        {images.map((image, index) => (
          <div key={index} className="image-card">
            <img src={image.url} alt={`Image ${index}`} />
            <div className="rating-container">
              <span>Rate this image:</span>
              {quality.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(image.id, rating)}
                  className={ratings[image.id] === rating ? 'active' : ''}
                >
                  {rating}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Add a comment..."
              value={comments[image.id] || ''}
              onChange={(e) => handleCommentChange(image.id, e.target.value)}
            ></textarea>
          </div>
        ))}
      </div>
      <button onClick={handleSaveData}>Next</button>
      <button onClick={handleSaveData}>Save Data</button>
    </div>
  );
}

export default App;
