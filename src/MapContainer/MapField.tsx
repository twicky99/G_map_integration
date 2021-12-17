// import React, {useCallback, useState} from "react";
// import {
//     GoogleMap,
//     withScriptjs,
//     withGoogleMap,
//     Marker,
// } from "react-google-maps";
// import {definition as faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {GeoCoordinates} from "../../../../../../reducers/cities";
// import {FieldProps} from "@rjsf/core";
// import {useI18n} from "../../../../../../i18n/I18nSupport";
//
// function Map({ location }: any) {
//     return (
//         <>
//             <GoogleMap
//                 defaultZoom={10}
//                 defaultCenter={{
//                     lat: location ? location.lat : 7,
//                     lng: location ? location.lng : 80,
//                 }}
//             >
//                 {location && <Marker position={{ ...location }} draggable />}
//             </GoogleMap>
//         </>
//     );
// }
//
// export const MapContainer = withScriptjs(withGoogleMap(Map));
//
//
// interface MapValueProps{
//     mapCoordinates: GeoCoordinates,
//     update(mapCoordinates: GeoCoordinates): void
// }
//
// export function MapValueRow({mapCoordinates, update}:MapValueProps){
//     const [latitude, setLatitude] = useState<number | null>(null);
//     const [longitude, setLongitude] = useState<number | null>(null);
//     const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
//     const [key, setKey] = useState(new Date().toISOString());
//     const {tx} = useI18n("checkoutSection.mapSection")
//
//
//     let updateWithData = useCallback<(data: Partial<GeoCoordinates>) => void>((data) => {
//         update({
//             ...mapCoordinates,
//             ...data
//         })
//     }, [mapCoordinates]);
//
//     const saveLocation = () => {
//         if (mapCoordinates.lat && mapCoordinates.lng) {
//             setKey(new Date().toISOString());
//             setLocation({ lat: mapCoordinates.lat, lng: mapCoordinates.lng });
//         }
//     };
//
//     return<div>
//         <div className="row checkout__header checkout__location-header inactive">
//             <div className="col-sm-9">
//                 <p className="mr-5 font-weight-bold ">
//                     <FontAwesomeIcon icon={faCheckCircle} size={"lg"} color={"grey"}/>
//                     {' '}{tx`confirmLocation`}
//                 </p>
//             </div>
//         </div>
//         <div className="checkout_shipping-address-new mt-3">
//             <MapContainer
//                 key={key}
//                 location={location}
//                 googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places`}
//                 loadingElement={<div style={{ height: `100%` }} />}
//                 containerElement={<div style={{ height: `400px` }} />}
//                 mapElement={<div style={{ height: `100%` }} />}
//             />
//
//             <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//                 <tr>
//                     <td>
//                         <span className="responsive-mobile-heading">{tx`latitudeLabel`}</span>
//                         <input className="form-control" value={mapCoordinates.lat} type="number" onChange={(e) => updateWithData({lat: !e.target.value ? undefined : parseFloat(e.target.value)})}/>
//                     </td>
//                     <td>
//                         <span className="responsive-mobile-heading offset-1 ">{tx`longitudeLabel`}</span>
//                         <input className="form-control offset-1" value={mapCoordinates.lng} type="number" onChange={(e) => updateWithData({lng: !e.target.value ? undefined : parseFloat(e.target.value)})}/>
//                     </td>
//                     <td>
//                         <span className="responsive-mobile-heading offset-1 mt-3">
//                         <button className="form-control btn btn-dark text-dark offset-2 mt-lg-5" value="Place On Map"  onClick={saveLocation}>
//                             {tx`placeOnMapLabel`}
//                         </button>
//                         </span>
//                     </td>
//                 </tr>
//             </div>
//         </div>
//
//     </div>
// }
//
//
// export default function MapField({formData, onChange}: FieldProps<GeoCoordinates>){
//
//
//     const [addressConfirmed, setAddressConfirmed] = useState(false);
//     const {tx} = useI18n("checkoutSection.mapSection")
//
//     return<div>
//         <>
//             <hr />
//             <MapValueRow mapCoordinates={formData}
//                          update={mapCoordinates => {
//                              onChange(mapCoordinates)
//                          }}/>
//
//             {!addressConfirmed ? (
//                 <div className="row justify-content-end mr-0">
//                     <div className="confirm-location">
//                         <p
//                             className="btn btn-primary  text-white  mt-3 "
//                             onClick={(e) => {
//                                 // e.preventDefault();
//                                 setAddressConfirmed(true);
//                             }}
//                         >
//                             {tx`confirmLocationLabel`}
//                         </p>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="row justify-content-end mr-0">
//                     <div className="confirmed-location">
//                         <button className="btn btn-light text-light  mt-3 ">
//                             {tx`locationConfirmedLabel`}
//                         </button>
//                         <button
//                             className="btn btn-secondary text-white  mt-3 "
//                             onClick={(e) => {
//                                 // e.preventDefault();
//                                 setAddressConfirmed(false);
//                             }}
//                         >
//                             {tx`changeLabel`}
//                         </button>
//                     </div>
//                 </div>
//             )}
//
//
//         </>
//     </div>
// }
import React, {useEffect, useState, ChangeEvent, useCallback} from "react";
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
} from "react-google-maps";
import { getGeocode } from "use-places-autocomplete";
import ReverseGeoLocation from "./ReverseGeoLocation";
import MapContainerProps from "./MapContainerInterface";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {GeoCoordinates} from "../../../../../../reducers/cities";
// import {FieldProps} from "@rjsf/core";
// import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
// import {useI18n} from "../../../../../../i18n/I18nSupport";

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

export const MapContainer = withScriptjs(withGoogleMap(Map));

// interface MapValueProps{
//     mapCoordinates: GeoCoordinates,
//     update(mapCoordinates: GeoCoordinates): void
// }
export default function MapField(){

    const [location, setLocation] = useState({ lat: 7, lng: 80 });
    const [lat, setLat] = useState(location.lat);
    const [lng, setLng] = useState(location.lng);
    const [zoomLevel, setZoomLevel] = useState(15);
    const [key] = useState(new Date().toISOString());
    const [locationOption, setLocationOption] = useState("geo_location");
    const [address, setAddress] = useState("")
    const [locationConfirmed, setLocationConfirmed] = useState(false)
    // const {tx} = useI18n("checkoutSection.mapSection")

    function updateLocation(event: ChangeEvent<HTMLInputElement>): any {
        const { name, value } = event.target;
        if (name === "lat") {
            setLat(Number(value));
            // updateWithData({lat: Number(value)})
        } else if (name === "lng") {
            setLng(Number(value));
            // updateWithData({lng: Number(value)})
        }
    }
    // let updateWithData = useCallback<(data: Partial<GeoCoordinates>) => void>((data) => {
    //     if(mapCoordinates){
    //         update({
    //             ...mapCoordinates,
    //             ...data
    //         })
    //     }
    //     console.log("mapCoordinates", mapCoordinates)
    // }, [mapCoordinates]);

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

    return (
        <div className="container-fluid">
            <div className="container-fluid m-0 p-0">
                <div className="py-2 fw-bold">
                    {/* <FontAwesomeIcon icon={faCheckCircle} size={"lg"} color={"grey"}/> */}
                    {/* <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" className="svg-inline--fa fa-check-circle fa-w-16 check-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg> */}
                    <span className="font-weight-bold">{' '}Confirm Location On Map</span></div>
                <div
                    className="p-2 justify-content-between"
                    // style={{ background: "#aad9fc" }}
                >
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
                <MapContainer
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
                                <button className= {locationConfirmed ? "me-2 btn custom-button bg-white float-right " : "me-2 btn custom-button bg-danger text-white float-right "} type="button" onClick={() => setLocationConfirmed(true)}>
                                    Confirm Location
                                </button>
                        }


                    </div>
                </div>
            </div>
        </div>
    );
}


