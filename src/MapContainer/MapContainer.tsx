import React, {ChangeEvent, useEffect, useState} from "react";
import {GoogleMap, Marker, withGoogleMap, withScriptjs,} from "react-google-maps";
import {getGeocode} from "use-places-autocomplete";
import ReverseGeoLocation from "./ReverseGeoLocation";
import MapContainerProps from "./MapContainerInterface";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
// import {useI18n} from "../../../../../../i18n/I18nSupport";
// import {useCart} from "../../../../../../reducers/cart/get";
// import {isSuccess} from "../../../../../../reducers/networkStateReducer";
// import {useSetShippingAddressGeoCoordinatesToCart} from "../../../../../../reducers/cart/setGeoCoordinates";

const MAP_HEIGHT: number = 500
const googleMapURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places";

function Map({ location, disabled, defaultZoom, isMarkerShown, mapClickHandler, dragHandler }: MapContainerProps) {

    const mapRef: any = React.useRef <HTMLInputElement>();
    // const [center, setCenter] = useState({ lat: 2, lng: 78 });

    const onMapLoad = React.useCallback((map: any) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
    }, []);

    useEffect(() => {
        panTo(location)
    }, [location, panTo])

    // const handleBoundsChanged = () => {
    //     const mapCenter = mapRef.current.getCenter(); //get map center
    //     if(!disabled)
    //         setCenter(mapCenter);
    // };
    return (
        <>
            <GoogleMap
                defaultZoom={defaultZoom}
                zoom={defaultZoom}
                defaultCenter={{
                    lat: location?.lat,
                    lng: location?.lng,
                }}
                // onBoundsChanged={handleBoundsChanged}
                onClick={!disabled ? mapClickHandler : null}
                ref={onMapLoad}
            >
                {location && isMarkerShown && (
                    <Marker
                        position={location}
                        draggable =  {!disabled}
                        defaultVisible={true}
                        onDragEnd={!disabled ? dragHandler : null}
                    ></Marker>
                )}
            </GoogleMap>
        </>
    );
}

export const MapView = withScriptjs(withGoogleMap(Map));


export default function MapContainer(){

    const [location, setLocation] = useState({ lat: 7, lng: 80 });
    const [lat, setLat] = useState(location.lat);
    const [lng, setLng] = useState(location.lng);
    const [zoomLevel, setZoomLevel] = useState(15);
    const [key] = useState(new Date().toISOString());
    const [locationOption, setLocationOption] = useState("geo_location");
    const [address, setAddress] = useState("")
    const [locationConfirmed, setLocationConfirmed] = useState(false)
    // const {tx} = useI18n("checkoutSection.mapSection")
    // const [cart, getCart]= useCart()
    // const [_, setGeoCoordinate, reset] = useSetShippingAddressGeoCoordinatesToCart()

    useEffect(() => {
        setLat(location.lat);
        setLng(location.lng);
        // update location
        if (locationOption === "geo_location" && window?.google) {
            setTimeout(() => {
                getGeocode({ location })
                    .then((results) => {
                        setAddress(results[0].formatted_address);
                    })
                    .catch((error) => {
                        console.log("Error: ", error);
                    });
            }, 200);
        }
    }, [location]);

    // useEffect(() => {
    //     if(isSuccess(cart)) {
    //         setLat(cart.data.shippingAddress?.geoCoordinates?.lat ?? location.lat)
    //         setLng(cart.data.shippingAddress?.geoCoordinates?.lng ?? location.lng)
    //     }
    // },[cart])

    // useEffect(() => {
    //     return reset
    // },[])

    function updateLocation(event: ChangeEvent<HTMLInputElement>): any {
        const { name, value } = event.target;
        if (name === "lat") {
            setLat(Number(value));
        } else if (name === "lng") {
            setLng(Number(value));
        }
    }

    function updateDataOnMap() {
        setLocation({ lat, lng });
    }


    function mapClickHandler(mapClickData: any){
        let { latLng } = mapClickData
        setLocation({ lat: latLng.lat(), lng: latLng.lng() });
        if(locationOption === "reverse_geo_location" ){
            setTimeout(() => {
                getGeocode({ location: { lat: latLng.lat(), lng: latLng.lng() } })
                    .then((results) => {
                            setAddress(results[0].formatted_address)
                        }
                    ).catch((error) => {
                    console.log("Error: ", error);
                });
            }, 200);
        }
    }


    function confirmOnMap() {
        setLocationConfirmed(true)
        // setGeoCoordinate({lat, lng})
    }

    return (
        <div className="container-fluid">
            <div className="container-fluid m-0 p-0">
                <div className="py-2 fw-bold">
                    {/* <FontAwesomeIcon icon={faCheckCircle} size={"lg"} color={"grey"}/> */}
                    <span className="font-weight-bold">{' '}Confirm Location On Map</span></div>

                <div className="p-2 justify-content-between">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="locationOption" id="geoLocation" value="geo_location" onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationOption(e.target.value)}
                            checked={locationOption === "geo_location"}
                        />
                        <label className="form-check-label mt-0" htmlFor="geoLocation">
                            View Location By Geo Co-ordinates
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="locationOption" id="reverseGeoLocation" value="reverse_geo_location" onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationOption(e.target.value)}
                            checked={locationOption === "reverse_geo_location"}
                        />
                        <label className="form-check-label mt-0" htmlFor="reverseGeoLocation">
                            View Location By Address
                        </label>
                    </div>
                </div>
                <MapView
                    key={key}
                    defaultZoom={zoomLevel}
                    location={location}
                    setLocation={setLocation}
                    mapClickHandler = {mapClickHandler}
                    isMarkerShown={true}
                    defaultCenter={location}
                    googleMapURL={googleMapURL}
                    disabled={locationConfirmed}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div style={{ height: MAP_HEIGHT + "px" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    dragHandler={mapClickHandler}
                />
            </div>
            <div className="row input-row">
                {locationOption === "reverse_geo_location" ? (
                    <>
                        <ReverseGeoLocation
                            setLocation={setLocation}
                            setZoomLevel={setZoomLevel}
                            updatedAddress={address}
                            disabled={locationConfirmed}
                        />
                    </>
                ) : (
                    <>
                        <div className="col-lg-4 col-md-4 col-sm-12 py-1">
                            <label>Latitude</label>
                            <input className="form-control map-input-control" type="number" name="lat" value={lat} disabled={locationConfirmed} placeholder="Enter Latitude" onChange={updateLocation}/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 py-1">
                            <label>Longitude</label>
                            <input className="form-control map-input-control" type="number" name="lng" value={lng} disabled={locationConfirmed} placeholder="Enter Longitude" onChange={updateLocation}/>
                        </div>
                        <div className="col-md-4 col-sm-12 p-0 py-2">
                            <div className="d-flex justify-content-center">
                                <button style = {{border: "1px solid #000"}} className="mt-0 btn custom-button place-button mt-4" type="button" onClick={() => locationConfirmed ? null: updateDataOnMap()}>
                                    Place On Map
                                </button>
                            </div>

                        </div>
                    </>
                )}
            </div>
            <div className="row">
                <div className="col-md-12 col-sm-12 position-relative pe-0 my-2">
                    <div>
                        {locationConfirmed &&
                            <button className="pl-2 btn custom-button bg-warning text-white fs-6 float-right" type="button" onClick={() => setLocationConfirmed(false)}>
                                Change
                            </button>
                        }

                        {
                            locationConfirmed ?
                                <div className="me-2 btn custom-button bg-white float-right" style={{cursor: "unset"}}>Location Confirmed</div>
                                :
                                <button className= {locationConfirmed ? "me-2 btn custom-button bg-white float-right " : "me-2 btn custom-button bg-danger text-white float-right "} type="button" onClick={() => confirmOnMap()}>
                                    Confirm Location
                                </button>
                        }


                    </div>
                </div>
            </div>
        </div>
    );
}