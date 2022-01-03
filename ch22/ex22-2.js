// JSON 객체

const rx_iso_date = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z)?$/;

const text = JSON.parse(text, function (key, value) {
  return (
    typeof value === "string" && (
      key.endsWith("_date")
	|| rx_iso_date.match(value)
    )
      ? new Date(value)
      : value
  );
});


const jsxon_text = JSON.stringify(my_little_object, function (key, value) {
  return (
    value instanceof Date
      ? value.toISOString()
      : value
  );
});
