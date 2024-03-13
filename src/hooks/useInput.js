import { useState } from "react"

export const useInput = () => {
    const [ value, setValue ] = useState("");

    const handleonChange = (e) => {
        setValue(() => e.target.value);
    }
    
    return [ value, setValue, handleonChange ];
}