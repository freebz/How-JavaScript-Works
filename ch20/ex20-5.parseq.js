// Parseq 구현

function make_reason(factory_name, excuse, evidence) {
  const reason = new Error("parseq." + factory_name + (
    excuse === undefined
      ? ""
      : ": " + excuse
  ));
  reason.evidence = evidence;
  return reason;
}


function check_callback(callback, factory_name) {
  if (typeof callback !== "function" || callback.length !== 2) {
    throw make_reason(factory_name, "Not a callback", callback);
  }
}


function check_requestor_array(requestor_array, factory_name) {
  if (
    !Array.isArray(requestor_array)
      || requestor_array.length < 1
      || requestor_array.some(function (requestor) {
	return (
	  typeof requestor !== "function"
	    || requestor.length < 1
	    || requestor.length > 2
	);
      })
  ) {
    throw make_reason(
      factory_name,
      "Bad requestors array.",
      requestor_array
    );
  }
}


function run(
  factory_name,
  requestor_array,
  initial_value,
  action,
  timeout,
  time_limit,
  throttle = 0
) {
  let cancel_array = new Array(requestor_array.length);
  let next_number = 0;
  let timer_id;

  function cancel(reason = make_reason(factory_name, "Cancel.")) {
    if (timer_id !== undefined) {
      clearTimeout(timer_id);
      timer_id = undefined;
    }

    if (cancel_array !== undefined) {
      cancel_array.forEach(function (cancel) {
	try {
	  if (typeof cancel === "function") {
	    return cancel(reason);
	  }
	} catch (ignore) {}
      });
      cancel_array = undefined;
    }
  }

  function start_requestor(value) {
    if (
      cancel_array !== undefined
	&& next_number < requestor_array.length
    ) {
      let number = next_number;
      next_number += 1;

      const requestor = requestor_array[number];
      try {
	cancel_array[number] = requestor(
	  function start_requestor_callback(value, reason) {
	    if (
	      cancel_array !== undefined
		&& number !== undefined
	    ) {
	      cancel_array[number] = undefined;
	      action(value, reason, number);
	      number = undefined;

	      return start_requestor(
		factory_name === "sequence"
		  ? value
		  : initial_value
	      );
	    }
	  },
	  value
	);

      } catch (exception) {
	action(undefined, exception, number);
	number = undefined;
	start_requestor(value);
      }
    }
  }


  if (time_limit !== undefined) {
    if (typeof time_limit === "number" && time_limit >= 0) {
      if (time_limit > 0) {
	timer_id = setTimeout(timeout, time_limit);
      }
    } else {
      throw make_reason(factory_name, "Bad time limit.", time_limit);
    }
  }

  if (!Number.isSafeInteger(throttle) || throttle < 0) {
    throw make_reason(factory_name, "Bad throttle.", throttle);
  }
  let repeat = Math.min(throttle || Infinity, requestor_array.length);
  while (repeat > 0) {
    setTimeout(start_requestor, 0, initial_value);
    repeat -= 1;
  }

  return cancel;
}


function  parallel(
  required_array,
  optional_array,
  time_limit,
  time_option,
  throttle,
  factory_name = "parallel"
) {
  let number_of_required;
  let requestor_array;

  if (required_array === undefined || required_array.length === 0) {
    number_of_required = 0;
    if (optional_array === undefined || optional_array.length === 0) {
      throw make_reason(
	factory_name,
	"Missing requestor array.",
	required_array
      );
    }

    requestor_array = optional_array;
    time_option = true;
  } else {
    number_of_required = required_array.length;
    if (optional_array === undefined || optional_array.length === 0) {
      requestor_array = required_array;
      time_option = undefined;
    } else {
      requestor_array = required_array.concat(optional_array);
      if (time_option !== undefined && typeof time_option !== "boolean") {
	throw make_reason(
	  factory_name,
	  "Bad time_option.",
	  time_option
	);
      }
    }
  }

  check_requestor_array(requestor_array, factory_name);
  return function parallel_requestor(callback, initial_value) {
    check_callback(callback, factory_name);
    let number_of_pending = requestor_array.length;
    let number_of_pending_required = number_of_required;
    let results = [];
    let cancel = run(
      factory_name,
      requestor_array,
      initial_value,
      function parallel_action(value, reason, number) {
	results[number] = value;
	number_of_pending -= 1;
	if (number < number_of_required) {
	  number_of_pending_required -= 1;
	  if (value === undefined) {
	    cancel(reason);
	    callback(undefined, reason);
	    callback = undefined;
	    return;
	  }
	}
	if (
	  number_of_pending < 1
	    || (
	      time_option === undefined
		&& number_of_pending_required < 1
	    )
	) {
	  cancel(make_reason(factory_name, "Optional."));
	  callback(
	    factory_name === "sequence"
	      ? results.pop()
	      : results
	  );
	  callback = undefined;
	}
      },
      function parallel_timeout() {
	const reason = make_reason(
	  factory_name,
	  "Timeout.",
	  time_limit
	);
	if (time_option === false) {
	  time_option = undefined;
	  if (number_of_pending_required < 1) {
	    cancel(reason);
	    callback(results);
	  }
	} else {
	  cancel(reason);
	  if (number_of_pending_required < 1) {
	    callback(results);
	  } else {
	    callback(undefined, reason);
	  }
	  callback = undefined;
	}
      },
      time_limit, throttle
    );
    return cancel;
  };
}


function race(requestor_array, time_limit, throttle) {
  const factory_name = (
    throttle === 1
      ? "fallback"
      : "race"
  );

  check_requestor_array(requestor_array, factory_name);
  return function race_requestor(callback, initial_value) {
    check_callback(callback, factory_name);
    let number_of_pending = requestor_array.length;
    let cancel = run(
      factory_name,
      requestor_array,
      initial_value,
      function race_action(value, reason, number) {
	number_of_pending -= 1;

	if (value !== undefined) {
	  cancel(make_reason(factory_name, "Loser.", number));
	  callback(value);
	  callback = undefined;
	}

	if (number_of_pending < 1) {
	  cancel(reason);
	  callback(undefined, reason);
	  callback = undefined;
	}
      },
      function race_timeout() {
	let reason = make_reason(
	  factory_name,
	  "Timeout.",
	  time_limit
	);
	cancel(reason);
	callback(undefined, reason);
	callback = undefined;
      },
      time_limit,
      throttle
    );
    return cancel;
  };
}


function fallback(requestor_array, time_limit) {
  return race(requestor_array, time_limit, 1);
}


function sequence(requestor_array, time_limit) {
  return parallel(
    requestor_array,
    undefined,
    time_limit,
    undefined,
    1,
    "sequence"
  );
}


import parseq from "./parseq.js";
