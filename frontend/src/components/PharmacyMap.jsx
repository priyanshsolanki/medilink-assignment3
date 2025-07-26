import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const PharmacyMap = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    lat: 44.6488,
    lng: -63.5752,
  }); // Default Halifax

  const mapContainerStyle = {
    width: "100%",
    height: "450px",
  };

  const fetchNearbyPharmacies = (location) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 3000, // meters
      type: "pharmacy",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPharmacies(results);
      }
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(current);
        fetchNearbyPharmacies(current);
      },
      () => {
        fetchNearbyPharmacies(userLocation); // fallback to default location
      }
    );
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDBYlxsHNERGTiyFAzGH_ql4OXMxyXC8oA"
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
      >
        {pharmacies.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            onClick={() => setSelected(place)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{
              lat: selected.geometry.location.lat(),
              lng: selected.geometry.location.lng(),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h4 className="font-bold">{selected.name}</h4>
              <p>{selected.vicinity}</p>
              <p>Rating: {selected.rating || "N/A"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default PharmacyMap;
