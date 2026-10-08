import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    hotels: []

};


const hotelSlice = createSlice({

    name: "hotels",

    initialState,

    reducers: {

        setHotels: (state, action) => {

            state.hotels =
                action.payload;

        },


        addHotel: (state, action) => {

            state.hotels.push(
                action.payload
            );

        },


        updateHotel: (state, action) => {

            const index =
                state.hotels.findIndex(
                    hotel =>
                        hotel.id ===
                        action.payload.id
                );


            if (index !== -1) {

                state.hotels[index] =
                    action.payload;

            }

        },


        removeHotel: (state, action) => {

            state.hotels =
                state.hotels.filter(
                    hotel =>
                        hotel.id !==
                        action.payload
                );

        }

    }

});


export const {

    setHotels,
    addHotel,
    updateHotel,
    removeHotel

} = hotelSlice.actions;


export default hotelSlice.reducer;