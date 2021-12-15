import React, { useEffect, useState, ChangeEvent } from "react";
import {
	GoogleMap,
	withScriptjs,
	withGoogleMap,
	Marker,
} from "react-google-maps";
import { getGeocode } from "use-places-autocomplete";
import ReverseGeoLocation from "./components/ReverseGeoLocation";
import MapContainerProps from "./interfaces/MapContainer.interface";

const googleMapURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places";

function Map({ location, disabled, defaultZoom, isMarkerShown, mapClickHandler }: MapContainerProps) {

	const mapRef: any = React.useRef <HTMLInputElement>();

	const onMapLoad = React.useCallback((map: any) => {
		mapRef.current = map;
	}, []);

	const panTo = React.useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng });
	}, []);

	useEffect(() => {
		panTo(location)
	}, [location, panTo])

	return (
		<>
			<GoogleMap
				defaultZoom={10}
				zoom={defaultZoom}
				defaultCenter={{
					lat: location?.lat,
					lng: location?.lng,
				}}
				onClick={!disabled ? mapClickHandler : null}
				ref={onMapLoad}
			>
				{location && isMarkerShown && (
					<Marker 
						position={location} 
						draggable =  {!disabled}
						defaultVisible={true} 
					></Marker>
				)}
			</GoogleMap>
		</>
	);
}

export const MapContainer = withScriptjs(withGoogleMap(Map));
export default function App() {

	const [location, setLocation] = useState({ lat: 2, lng: 73 });
	const [lat, setLat] = useState(location.lat);
	const [lng, setLng] = useState(location.lng);
	const [zoomLevel, setZoomLevel] = useState(8);
	const [key] = useState(new Date().toISOString());
	const [locationOption, setLocationOption] = useState("geo_location");
	const [address, setAddress] = useState("")
	const [locationConfirmed, setLocationConfirmed] = useState(false)

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
			getGeocode({ location: { lat: latLng.lat(), lng: latLng.lng() } })
			.then((results) => {
				// console.log("📍 DATA: ", results[0].formatted_address)
				setAddress(results[0].formatted_address)
			}
			).catch((error) => {
				console.log("😱 Error: ", error);
			});
		}
	}

	useEffect(() => {
		setLat(location.lat);
		setLng(location.lng);
	}, [location]);

	return (
		<div className="container-fluid">
			<div className="container-fluid m-0 p-0">
				<div className="py-2 fw-bold">
					<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" className="svg-inline--fa fa-check-circle fa-w-16 check-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>
					Confirm Location on map</div>
				<div
					className="p-2 justify-content-between"
					style={{ background: "#aad9fc" }}
				>
					<div className="form-check form-check-inline">
						<input
							className="form-check-input"
							type="radio"
							name="locationOption"
							id="geoLocation"
							value="geo_location"
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setLocationOption(e.target.value)
							}
							checked={locationOption === "geo_location"}
						/>
						<label
							className="form-check-label mt-0"
							htmlFor="geoLocation"
						>
							Geo Location
						</label>
					</div>
					<div className="form-check form-check-inline">
						<input
							className="form-check-input"
							type="radio"
							name="locationOption"
							id="reverseGeoLocation"
							value="reverse_geo_location"
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setLocationOption(e.target.value)
							}
							checked={locationOption === "reverse_geo_location"}
						/>
						<label
							className="form-check-label mt-0"
							htmlFor="reverseGeoLocation"
						>
							Reverse Geo Location
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
					containerElement={<div style={{ height: "400px" }} />}
					mapElement={<div style={{ height: "100%" }} />}
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
						<div className="col-md-5 col-sm-12 py-1">
							<input
								className="form-control map-input-control"
								type="text"
								name="lat"
								value={lat}
								disabled={locationConfirmed}
								placeholder="Enter Latitude"
								onChange={updateLocation}
							/>
						</div>
						<div className="col-md-5 col-sm-12 py-1">
							<input
								className="form-control map-input-control"
								type="text"
								name="lng"
								value={lng}
								disabled={locationConfirmed}
								placeholder="Enter Longitude"
								onChange={updateLocation}
							/>
						</div>
						<div className="col-md-2 col-sm-12 p-0 py-2">
							<div className="d-flex justify-content-center">
								<button
									className="mt-0 btn custom-button place-button"
									type="button"
									onClick={() => locationConfirmed ? null: updateDataOnMap()}
								>
									Place on Map
								</button>
							</div>
							
						</div>
					</>
				)}
				<div className="row">
					<div className="col-md-12 col-sm-12 position-relative pe-0 my-2"> 
						<div  className="d-flex justify-content-end" style={{right: 1}}>
							<button
								className= {locationConfirmed ? "me-2 btn custom-button bg-white map-shadow" : "me-2 btn custom-button bg-danger text-white"}
								type="button"
								onClick={() => setLocationConfirmed(true)}
							>
								Confirm Location
							</button>
							{locationConfirmed && 
							<button
								className="pl-2 btn custom-button bg-warning text-white fs-6 map-shadow"
								type="button"
								onClick={() => setLocationConfirmed(false)}
							>
								Change
							</button>}
						</div>
					</div>
				</div> 
			</div>
		</div>
	);
}