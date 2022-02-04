// JSCheck

import jsc from "./jscheck.js";


let my_little_array_specifier = jsc.array([
  jsc.integer(),
  jsc.number(100),
  jsc.string(8, jsc.character("A", "Z"))
])

my_little_array_specifier()	// [179, 21.228644298389554, "TJFJPLQA"]
my_little_array_specifier()	// [797, 57.05485427752137, "CWQDVXWY"]
my_little_array_specifier()	// [941, 91,98980208020657, "QVMGNVXK"]
my_little_array_specifier()	// [11, 87.07735128700733, "GXBSVLKJ"]


let my_other_little_array_specifier = jsc.array(4);

my_other_little_array_specifier()  // [659, 383, 991, 821]
my_other_little_array_specifier()  // [479, 701, 47, 601]
my_other_little_array_specifier()  // [389, 271, 113, 263]
my_other_little_array_specifier()  // [251, 557, 547, 197]


let my_little_3_letter_word_specifier = jsc.string(
  jsc.sequence(["c", "d", "f"]),
  jsc.sequence(["a", "o", "i", "e"]),
  jsc.sequence(["t", "g", "n", "s", "l"])
);

my_little_3_letter_word_specifier()  // "cat"
my_little_3_letter_word_specifier()  // "dog"
my_little_3_letter_word_specifier()  // "fin"
my_little_3_letter_word_specifier()  // "ces"


let my_little_ssn_specifier = jsc.string(
  3, jsc.character("0", "9"),
  "-",
  2, jsc.character("0", "9"),
  "-",
  4, jsc.character("0", "9")
);

my_little_ssn_specifier()  // "231-89-2167"
my_little_ssn_specifier()  // "706-32-0392"
my_little_ssn_specifier()  // "931-89-4315"
my_little_ssn_specifier()  // "636-20-3790"


let my_little_constructor = jsc.object(
  jsc.array(
    jsc.integer(3, 6),
    jsc.string(4, jsc.character("a", "z"))
  ), jsc.boolean()
);

my_little_constructor()
// {"hiyt": false, "rodf": true, "bfxf": false, "ygat": false, "hwqe": false}
my_little_constructor()
// {"hwbh": true, "ndjt": false, "chsn": true, "fdag": true, "hvme": true}
my_little_constructor()
// {"qedx": false, "uoyp": true, "ewes": true}
my_little_constructor()
// {"igko": true, "txem": true, "yadl": false, "avwz": true}


let my_little_other_constructor = jsc.object({
  left: jsc.integer(640),
  top: jsc.integer(480),
  color: jsc.one_of(["black", "white", "red", "blue", "green", "gray"])
});

my_little_other_constructor()  // {"left": 305, "top": 360, "color": "gray"}
my_little_other_constructor()  // {"left": 162, "top": 366, "color": "blue"}
my_little_other_constructor()  // {"left": 110, "top": 5, "color": "blue"}
my_little_other_constructor()  // {"left": 610, "top": 61, "color": "green"}


const ctp = "{name}: {class}{cases} cases tested, {pass} pass{fail}{lost}\n";

function crunch(detail, cases, serials) {
  let class_fail;
  let class_pass;
  let class_lost;
  let case_nr = 0;
  let lines = "";
  let losses = [];
  let next_case;
  let new_claim;
  let nr_class = 0;
  let nr_fail;
  let nr_lost;
  let nr_pass;
  let report = "";
  let the_case;
  let the_class;
  let total_fail = 0;
  let total_lost = 0;
  let total_pass = 0;

  function generate_line(type, level) {
    if (detail >= level) {
      lines += fulfill(
	" {type} [{serial}] {classification}{args}\n",
	{
	  type,
	  serial: the_case.serial,
	  classification: the_case.classification,
	  args: JSON.stringify(
	    the_case.args
	  ).replace(
	    /^\[/,
	    "("
	  ).replace(
	    /\]$/,
	    ")"
	  )
	}
      );
    }
  }

  function generate_class(key) {
    if (detail >= 3 || class_fail[key] || class_lost[key]) {
      report += fulfill(
	" {key} pass {pass}{fail}{lost}\n",
	{
	  key,
	  pass: class_pass[key],
	  fail: (
	    class_fail[key]
	      ? " fail " + class_fail[key]
	      : ""
	  ),
	  lost: (
	    class_lost[key]
	      ? " lost " + class_lost[key]
	      : ""
	  )
	}
      );
    }
  }

  if (cases) {
    while (true) {
      next_case = cases[serials[case_nr]];
      case_nr += 1;
      if (!next_case || (next_case.claim !== now_claim)) {
	if (now_claim) {
	  if (detail >= 1) {
	    report += fulfill(
	      ctp,
	      {
		name: the_case.name,
		class: (
		  nr_class
		    ? nr_class + " classifications, "
		    : ""
		),
		cases: nr_pass + nr_fail + nr_lost,
		pass: nr_pass,
		fail: (
		  nr_fail
		    ? ", " + nr_fail + " fail"
		    : ""
		),
		lost: (
		  nr_lost
		    ? ", " + nr_lost + " lost"
		    : ""
		)
	      }
	    );
	    if (detail >= 2) {
	      Object.keys(
		class_pass
	      ).sort().forEach(
		generate_class
	      );
	      report += lines;
	    }
	  }
	  total_fail += nr_fail;
	  total_lost += nr_lost;
	  total_pass += nr_pass;
	}
	if (!next_case) {
	  break;
	}
	nr_class = 0;
	nr_fail = 0;
	nr_lost = 0;
	nr_pass = 0;
	class_pass = {};
	class_fail = {};
	class_lost = {};
	lines = "";
      }
      the_case = next_case;
      now_claim = the_case.claim;
      the_class = the_case.classification;
      if (the_class && typeof class_pass[the_class] !== "number") {
	class_pass[the_class] = 0;
	class_fail[the_class] = 0;
	class_lost[the_class] = 0;
	nr_class += 1;
      }
      if (the_case.pass === true) {
	if (the_class) {
	  class_pass[the_class] += 1;
	}
	if (detail >= 4) {
	  generate_line("Pass", 4);
	}
	nr_pass += 1;
      } else if (the_case.pass === false) {
	if (the_class) {
	  class_fail[the_class] += 1;
	}
	generate_line("FAIL", 2);
	nr_fail += 1;
      } else {
	if (the_class) {
	  class_lost[the_class] += 1;
	}
	generate_line("LOST", 2);
	losses[nr_lost] = the_case;
	nr_lost += 1;
      }
    }
    report += fulfill(
      "\nTotal pass {pass}{fail}{lost}\n",
      {
	pass: total_pass,
	fail: (
	  total_fail
	    ? ", fail " + total_fail
	    : ""
	),
	lost: (
	  total_lost
	    ? ", lost " + total_lost
	    : ""
	)
      }
    );
  }
  return {losses, report, summary: {
    pass: total_pass,
    fial: total_fail,
    lost: total_lost,
    total: total_pass + total_fail + total_lost,
    ok: total_lost === 0 && total_fail === 0 && total_pass > 0
  }};
}
