"use client"; 
import React, { ReactElement } from 'react';
import { useState, KeyboardEvent } from "react";

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  totalStars = 5,
  initialRating = 0,
  onRatingChange,
}: StarRatingProps): ReactElement {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "ArrowRight") {
      const newRating = Math.min(totalStars, rating + 1);
      setRating(newRating);
      onRatingChange && onRatingChange(newRating);
    } else if (event.key === "ArrowLeft") {
      const newRating = Math.max(0, rating - 1);
      setRating(newRating);
      onRatingChange && onRatingChange(newRating);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Star rating"
      className="flex space-x-1"
    >
      {Array.from({ length: totalStars }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= (hover || rating);
        return (
          <span
            key={index}
            role="radio"
            aria-checked={rating === starNumber}
            tabIndex={0}
            onClick={() => {
              setRating(starNumber);
              onRatingChange && onRatingChange(starNumber);
            }}
            onKeyDown={(e) => handleKeyDown(starNumber, e)}
            onMouseEnter={() => setHover(starNumber)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer text-2xl ${
              isFilled ? "text-purpleTheme" : "text-gray-300"
            }`}
            aria-label={`Rate ${starNumber} star${starNumber > 1 ? "s" : ""}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}