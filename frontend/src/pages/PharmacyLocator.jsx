import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Filter, ChevronRight } from "lucide-react";
import Patientsidebar from "../components/Patientsidebar";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const PharmacyLocator = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userLocation, setUserLocation] = useState({
    lat: 44.6488,
    lng: -63.5752,
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const pharmacyRefs = useRef({});

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const calculateWalkingDistance = async (origin, destination) => {
    const service = new window.google.maps.DirectionsService();
    return new Promise((resolve) => {
      service.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") {
            const distance = result.routes[0].legs[0].distance.text;
            resolve(distance);
          } else {
            resolve("N/A");
          }
        }
      );
    });
  };

  const fetchNearbyPharmacies = async (location) => {
    if (!mapRef.current || !window.google?.maps?.places?.PlacesService) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: "pharmacy",
    };

    service.nearbySearch(request, async (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const enriched = await Promise.all(
          results.map(async (r) => {
            const loc = {
              lat: r.geometry.location.lat(),
              lng: r.geometry.location.lng(),
            };
            const distance = await calculateWalkingDistance(location, loc);
            return {
              id: r.place_id,
              name: r.name,
              address: r.vicinity,
              location: loc,
              open: r.opening_hours?.open_now ?? false,
              rating: r.rating,
              hours: "Loading...",
              distance,
            };
          })
        );
        setPharmacies(enriched);
      }
    });
  };

  useEffect(() => {
    if (!mapLoaded) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(current);
        fetchNearbyPharmacies(current);
      },
      () => fetchNearbyPharmacies(userLocation)
    );
  }, [mapLoaded]);

  const handleMarkerClick = (pharmacy) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.getDetails({ placeId: pharmacy.id }, (details, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPharmacy({
          ...pharmacy,
          hours: details.opening_hours?.weekday_text || ["Hours not available"],
        });
      } else {
        setSelectedPharmacy(pharmacy);
      }
    });

    pharmacyRefs.current[pharmacy.id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch = pharmacy.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "open" && pharmacy.open) ||
      (selectedFilter === "closed" && !pharmacy.open);
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <span className="text-yellow-500 text-sm">
        {"★".repeat(full)}
        {half && "☆"}
        <span className="text-gray-300">{"★".repeat(empty)}</span>
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Patientsidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Pharmacy Locator
              </h1>
              <p className="text-gray-600">
                Find nearby pharmacies to fill your prescriptions
              </p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Pharmacies</option>
                  <option value="open">Open Now</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <LoadScript
              googleMapsApiKey="AIzaSyDBYlxsHNERGTiyFAzGH_ql4OXMxyXC8oA"
              libraries={["places"]}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={13}
                onLoad={(map) => {
                  mapRef.current = map;
                  setMapLoaded(true);
                }}
              >
                {filteredPharmacies.map((pharmacy) => (
                  <Marker
                    key={pharmacy.id}
                    position={pharmacy.location}
                    onClick={() => handleMarkerClick(pharmacy)}
                  />
                ))}
                {selectedPharmacy && (
                  <InfoWindow
                    position={selectedPharmacy.location}
                    onCloseClick={() => setSelectedPharmacy(null)}
                  >
                    <div>
                      <h4 className="font-bold text-sm">
                        {selectedPharmacy.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {selectedPharmacy.address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedPharmacy.open ? "Open Now" : "Closed"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rating: {selectedPharmacy.rating || "N/A"}
                      </p>
                      <div className="mt-2">
                        {selectedPharmacy.hours?.map((line, idx) => (
                          <p key={idx} className="text-xs text-gray-500">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Pharmacy List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Nearby Pharmacies ({filteredPharmacies.length})
              </h2>
            </div>
            <div className="p-6">
              {filteredPharmacies.length > 0 ? (
                <div className="space-y-4">
                  {filteredPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      ref={(el) => (pharmacyRefs.current[pharmacy.id] = el)}
                      className={`flex flex-col sm:flex-row items-start justify-between p-4 border rounded-lg transition-all duration-200 ${
                        selectedPharmacy?.id === pharmacy.id
                          ? "bg-blue-50 border-blue-400 shadow-md"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {pharmacy.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {pharmacy.address}
                          </p>

                          {pharmacy.rating && (
                            <div className="text-sm mt-1">
                              {renderStars(pharmacy.rating)}{" "}
                              <span className="text-xs text-gray-500 ml-1">
                                ({pharmacy.rating})
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                pharmacy.open
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {pharmacy.open ? "Open Now" : "Closed"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {pharmacy.distance}
                            </span>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              pharmacy.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                          >
                            Get Directions
                          </a>
                        </div>
                      </div>
                      <button className="p-2 text-blue-600 hover:text-blue-800 self-end sm:self-auto">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pharmacies found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyLocator;
