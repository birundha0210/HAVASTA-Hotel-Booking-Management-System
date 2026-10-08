import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import { Helmet } from "react-helmet-async";

import logo from "../assets/logo.png";
import name from "../assets/name.png";


function HotelDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [hotel, setHotel] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =================================
       IMAGE URL
    ================================= */

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000${image}`;

    };


    /* =================================
       FETCH HOTEL
    ================================= */

    useEffect(() => {

        const fetchHotel = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                   FIRST:
                   Try direct ID API.
                */

                try {

                    const response =
                        await axios.get(

                            `http://localhost:5000/api/hotels/${id}`

                        );


                    if (
                        response.data.hotel
                    ) {

                        setHotel(
                            response.data.hotel
                        );

                        return;

                    }

                } catch (directError) {

                    console.log(
                        "Direct hotel API unavailable. Trying list API..."
                    );

                }


                /*
                   FALLBACK:
                   Get hotels from normal
                   GET /api/hotels API.
                */

                const listResponse =
                    await axios.get(

                        "http://localhost:5000/api/hotels",

                        {
                            params: {
                                limit: 50,
                                offset: 0
                            }
                        }

                    );


                const hotels =
                    listResponse.data.hotels ||
                    [];


                const foundHotel =
                    hotels.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );


                if (!foundHotel) {

                    setError(
                        "Hotel not found."
                    );

                    return;

                }


                setHotel(
                    foundHotel
                );


            } catch (error) {

                console.error(
                    "Failed to load hotel:",
                    error
                );

                setError(
                    "Hotel not found."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchHotel();

    }, [id]);


    /* =================================
       LOADING
    ================================= */

    if (loading) {

        return (

            <div className="page-loader">

                <div className="spinner"></div>

                <p>
                    Loading hotel...
                </p>

            </div>

        );

    }


    /* =================================
       ERROR
    ================================= */

    if (error || !hotel) {

        return (

            <div className="empty">

                <h2>
                    {error || "Hotel not found."}
                </h2>

                <button
                    className="view-button"
                    onClick={() =>
                        navigate("/")
                    }
                >

                    Back to Hotels

                </button>

            </div>

        );

    }


    /* =================================
       MAP
    ================================= */

    const latitude =
        Number(hotel.latitude);

    const longitude =
        Number(hotel.longitude);


    const mapUrl =
        `https://www.openstreetmap.org/export/embed.html?bbox=${
            longitude - 0.08
        }%2C${
            latitude - 0.08
        }%2C${
            longitude + 0.08
        }%2C${
            latitude + 0.08
        }&layer=mapnik&marker=${
            latitude
        }%2C${
            longitude
        }`;


    return (

        <>

            <Helmet>

                <title>
                    {hotel.title} | HAVESTA
                </title>

                <meta
                    name="description"
                    content={
                        hotel.description
                    }
                />

            </Helmet>


            <div className="details-page">


                {/* =================================
                    HEADER
                ================================= */}

                <header className="details-header">


                    <div className="details-brand">

                        <img
                            src={logo}
                            alt="HAVESTA logo"
                        />

                        <img
                            src={name}
                            alt="HAVESTA"
                        />

                    </div>


                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >

                        ← Back to Hotels

                    </button>


                </header>


                {/* =================================
                    DETAILS
                ================================= */}

                <main className="details-container">


                    <div className="details-layout">


                        {/* LEFT */}

                        <section className="details-left">


                            <div className="details-image">

                                <img
                                    src={
                                        getImageUrl(
                                            hotel.image
                                        )
                                    }
                                    alt={
                                        hotel.title
                                    }
                                />

                            </div>


                            <div className="hotel-info-card">


                                <h3>
                                    Hotel Information
                                </h3>


                                <div className="info-row">

                                    <span>
                                        Hotel Name
                                    </span>

                                    <strong>
                                        {hotel.title}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Price Per Night
                                    </span>

                                    <strong>

                                        ₹
                                        {Number(
                                            hotel.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Description
                                    </span>

                                    <strong>
                                        {hotel.description}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Latitude
                                    </span>

                                    <strong>
                                        {hotel.latitude}
                                    </strong>

                                </div>


                                <div className="info-row">

                                    <span>
                                        Longitude
                                    </span>

                                    <strong>
                                        {hotel.longitude}
                                    </strong>

                                </div>


                            </div>


                        </section>


                        {/* RIGHT */}

                        <section className="details-right">


                            <div className="hotel-label">

                                HOTEL DETAILS

                            </div>


                            <h1>
                                {hotel.title}
                            </h1>


                            <div className="detail-price">

                                ₹
                                {Number(
                                    hotel.price
                                ).toLocaleString(
                                    "en-IN"
                                )}

                                <span>
                                    / night
                                </span>

                            </div>


                            <p className="detail-description">

                                {hotel.description}

                            </p>


                            <div className="coordinates">


                                <div>

                                    <span>
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            Latitude
                                        </small>

                                        <strong>
                                            {hotel.latitude}
                                        </strong>

                                    </div>

                                </div>


                                <div>

                                    <span>
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            Longitude
                                        </small>

                                        <strong>
                                            {hotel.longitude}
                                        </strong>

                                    </div>

                                </div>


                            </div>


                            <div className="details-promo">


                                <img
                                    src={
                                        getImageUrl(
                                            hotel.image
                                        )
                                    }
                                    alt=""
                                />


                                <div>

                                    <span>
                                        HAVESTA EXPERIENCE
                                    </span>

                                    <h3>
                                        Stay beyond ordinary.
                                    </h3>

                                    <p>
                                        Discover beautiful stays with HAVESTA.
                                    </p>

                                </div>


                            </div>


                        </section>


                    </div>


                    {/* =================================
                        MAP
                    ================================= */}

                    <section className="map-section">


                        <div className="map-heading">

                            <div>

                                <span>
                                    LOCATION
                                </span>

                                <h2>
                                    Hotel Location
                                </h2>

                            </div>


                            <p>
                                Based on hotel coordinates
                            </p>

                        </div>


                        <div className="map-container">

                            <iframe
                                title="Hotel Location"
                                src={mapUrl}
                                loading="lazy"
                            ></iframe>

                        </div>


                    </section>


                </main>

            </div>

        </>

    );

}

export default HotelDetails;