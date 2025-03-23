"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { FaMapMarkedAlt, FaBus, FaChild, FaSun, FaDollarSign } from "react-icons/fa";

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface Attraction {
    name: string;
    description: string;
    image: string;
}

interface Hotel {
    name: string;
    description: string;
    image: string;
}

interface Cuisine {
    name: string;
    description: string;
    image: string;
}

interface DestinationDetails {
    location: { country: string; coordinates: Coordinates };
    popular_attractions: Attraction[];
    hotels: Hotel[];
    local_cuisine: Cuisine[];
}

const Destination = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const name = searchParams.get("name");
    const [details, setDetails] = useState<DestinationDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const attractionsScrollRef = useRef<HTMLDivElement>(null);
    const hotelsScrollRef = useRef<HTMLDivElement>(null);
    const cuisineScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (name) {
            setLoading(true);
            setError(null);
            fetch(`/api/getDestinationDetails ? name = ${encodeURIComponent(name)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                        setDetails(null);
                    } else {
                        setDetails(data.details);
                    }
                })
                .catch(() => setError("Failed to fetch destination details."))
                .finally(() => setLoading(false));
        }
    }, [name]);

    // Automatic scrolling for attractions
    useEffect(() => {
        const interval = setInterval(() => {
            if (attractionsScrollRef.current && details?.popular_attractions.length) {
                const scrollContainer = attractionsScrollRef.current;
                const scrollWidth = scrollContainer.scrollWidth;
                const visibleWidth = scrollContainer.clientWidth;

                if (scrollContainer.scrollLeft + visibleWidth >= scrollWidth) {
                    scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [details]);

    // Click-based scrolling for Hotels
    const scrollHotels = (direction: "left" | "right") => {
        if (hotelsScrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            hotelsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    // Click-based scrolling for Local Cuisine
    const scrollCuisine = (direction: "left" | "right") => {
        if (cuisineScrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            cuisineScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section>
            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && details && (
                <>
                    {/* Attractions Section with Automatic Scrolling */}
                    <div
                        className="w-screen py-24 bg-cover bg-center bg-no-repeat mt-14"
                        style={{ backgroundImage: "url('/attractions.jpg')" }}
                    >
                        <div className="max-w-6xl mx-auto px-6">
                            <h2 className="text-5xl font-extrabold text-[#333333] text-center tracking-wide mb-1">
                                ATTRACTIONS
                            </h2>
                            <p className="text-lg text-[#333333] font-light tracking-wider text-center mt-0">
                                — worth a thousand stories —
                            </p>

                            <div className="relative mt-10">
                                <div ref={attractionsScrollRef} className="flex gap-6 overflow-x-hidden scrollbar-hide scroll-smooth">
                                    {details.popular_attractions.map((attraction, index) => (
                                        <div key={index} className="min-w-[250px] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                                            <img src={attraction.image} alt={attraction.name} className="w-full h-56 object-cover" />
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-black">{attraction.name}</h3>
                                                <p className="text-gray-600 mt-2">{attraction.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hotels Section with Manual Scrolling */}
                    <div className="w-screen py-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hotels.jpg')" }}>
                        <div className="max-w-6xl mx-auto px-6">
                            <h2 className="text-5xl font-extrabold text-[#333333] text-center tracking-wide mb-1">
                                HOTELS
                            </h2>
                            <p className="text-lg text-[#333333] font-light tracking-wider text-center mt-0">
                                — check-in for comfort, check-out with memories —
                            </p>
                            <div className="relative mt-10">
                                <button
                                    onClick={() => scrollHotels("left")}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10"
                                >
                                    <RiArrowLeftLine size={24} />
                                </button>
                                <div ref={hotelsScrollRef} className="flex gap-6 overflow-x-hidden scrollbar-hide scroll-smooth no-scrollbar">
                                    {details.hotels.map((hotel, index) => (
                                        <div
                                            key={index}
                                            className="min-w-[300px] bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                                            onClick={() => router.push(`/hotelDetails?name=${encodeURIComponent(hotel.name)}`)}
                                        >
                                            <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                                            <h3 className="text-xl font-bold text-black">{hotel.name}</h3>
                                            <p className="text-gray-600 mt-2">{hotel.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => scrollHotels("right")}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10"
                                >
                                    <RiArrowRightLine size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Local Cuisine Section with Manual Scrolling */}
                    <div className="w-screen py-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/cuisine.jpg')" }}>
                        <div className="max-w-6xl mx-auto px-6">
                            <h2 className="text-5xl font-extrabold text-[#333333] text-center tracking-wide mb-1">
                                LOCAL CUISINE
                            </h2>
                            <p className="text-lg text-[#333333] font-light tracking-wider text-center mt-0">
                                — a taste of tradition —
                            </p>

                            <div className="relative mt-10">
                                <button onClick={() => scrollCuisine("left")} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10">
                                    <RiArrowLeftLine size={24} />
                                </button>
                                <div ref={cuisineScrollRef} className="flex gap-6 overflow-x-hidden scrollbar-hide scroll-smooth no-scrollbar">
                                    {details.local_cuisine.map((dish, index) => (
                                        <div key={index} className="min-w-[450px] max-w-[450px] h-[300px] bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col">
                                            <img src={dish.image} alt={dish.name} className="w-full h-[180px] object-cover rounded-lg mb-3" />
                                            <h3 className="text-lg font-semibold text-black truncate text-center">{dish.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1 text-center line-clamp-3">{dish.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => scrollCuisine("right")} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10">
                                    <RiArrowRightLine size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </section>
    );
};

export default Destination;