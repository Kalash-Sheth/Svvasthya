// BookingContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState(() => {
        // Get the booking data from local storage on initialization
        const savedData = localStorage.getItem("bookingData");
        return savedData ? JSON.parse(savedData) : {
            mainService: "",
            subService: "",
            duration: "",
            price: "",
            startTime: "",
            endTime: "",
            address: { fullAddress: "", houseNumber: "", landmark: "", name: "" }, 
        };
    });

    // Effect to save bookingData to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("bookingData", JSON.stringify(bookingData));
    }, [bookingData]);

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    return useContext(BookingContext);
};
