import React, { useEffect, useState } from 'react'
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

export default function ReverseGeoLocation({setLocation, setZoomLevel, updatedAddress, disabled} : any) : JSX.Element {
    const [address, setAddress] = useState("")
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    useEffect(() => {
        setAddress(value);
    }, [value])

    useEffect(() => {
        if(updatedAddress){
            setAddress(updatedAddress);
        }
    }, [updatedAddress])

    const handleSelect = (val: string): any  => {
        getGeocode({ address: val })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                // console.log(" Coordinates: ", { lat, lng });
                setLocation({ lat, lng });
                setZoomLevel(15)
            })
            .catch((error) => {
                console.log("Error: ", error);
            });

        setValue(val, false);
        clearSuggestions()
    };

    const renderSuggestions = (): JSX.Element => {
        const suggestions = data.map(({ place_id, description }: any) => (
            <ComboboxOption key={place_id} value={description} />
        ));
        return <>{suggestions}</>;
    };

    return (
        <>
            <Combobox onSelect={handleSelect}  style = {{width: "90%", paddingTop: "10px", marginLeft: "14px"}} aria-labelledby="inputSearch">
                <ComboboxInput
                    className="form-control"
                    style={{maxWidth: "100%" }}
                    value={address}
                    onChange={handleInput}
                    disabled={!ready|| (ready && disabled) }
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && renderSuggestions()}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </>
    );
}