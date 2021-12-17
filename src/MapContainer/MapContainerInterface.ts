import Location from "./LocationInterface";

export default interface MapContainerProps {
    key: string;
	defaultZoom: number;
	location: Location
	setLocation: any
	mapClickHandler: any
	isMarkerShown: boolean
	defaultCenter: Location
	googleMapURL: string
	disabled: boolean
	loadingElement: any
	containerElement: any
	mapElement: any
	onClick?:  any
	onDrag?:  any
	dragHandler?:  any
}