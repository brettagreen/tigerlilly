import { useState } from "react";

function useForm(initialVal = true) {
	// call useState, "reserve piece of state"
	const [value, setValue] = useState(initialVal);
	const showForm = () => {
		setValue(oldValue => !oldValue);
	};

	// return piece of state AND a function to toggle it
	return [value, showForm];
}

export default useForm;