const randFromArray = (items) => (
	items[Math.floor(Math.random() * items.length)]
);

export default randFromArray;