
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"; // Relative import

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from 'react';


export  default function Reviews({ restaurantId }) {
    const [reviews, setReviews] = useState([]);
  
    useEffect(() => {
      fetchReviews();
    }, []);
  
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/reviews/`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    const renderStars = (rating) => {
      return (
        <div className="flex gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              {i < Math.floor(rating) ? "★" : "☆"}
            </span>
          ))}
        </div>
      );
    };
  
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Restaurant Reviews and Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length === 0 ? (
            <Alert className="bg-gray-50">
              <AlertTitle className="text-gray-700">No reviews yet</AlertTitle>
              <AlertDescription>Be the first to review this restaurant!</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-600 mt-2">{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  