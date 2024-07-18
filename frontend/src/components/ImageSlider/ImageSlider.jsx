import { useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
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
            <button onClick={prevImage} className="slider-button">
                <FaAngleLeft />
            </button>
            <img
                src={images[currentImageIndex].url}
                alt={`Slide ${currentImageIndex + 1}`}
                className="slider-image"
                loading="lazy"
            />
            <button onClick={nextImage} className="slider-button">
                <FaAngleRight />
            </button>
        </div>
    );
}

export default ImageSlider;
