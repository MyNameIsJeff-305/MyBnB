import { useState } from "react";
import './ImageSlider.css';

function ImageSlider({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="image-slider">
            <button onClick={prevImage} aria-label="Previous Image" className="slider-button">
                <svg viewBox="0 0 24 24">
                    <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                </svg>
            </button>
            <img 
                src={images[currentImageIndex].url} 
                alt={`Slide ${currentImageIndex + 1}`} 
                className="slider-image" 
                loading="lazy" 
            />
            <button onClick={nextImage} aria-label="Next Image" className="slider-button">
                <svg viewBox="0 0 24 24">
                    <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
            </button>
        </div>
    );
}

export default ImageSlider;
