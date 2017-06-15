export const handleError = (error) => {
	return {
		type: 'ERROR/SHOW',
		error: error,
	};
};
