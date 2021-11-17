// 템플릿 문자열 리터럴

const old_form = (
  "Can you"
    + "\nbelieve how"
    + "\nincredibly"
    + "\nlong this"
    + "\nstring literal"
    + "\nis?"
);

const new_form = `Can you
believe how
incredibly
long this
string literal
is?`;

old_form === new_form		// true


let fear = "monsters";

const old_way = "The only thing we have to fear is " + fear + ".";

const new_way = `The only thing we have to fear is ${fear}.`;

old_way === new_way		// true


function dump(strings, ...values) {
  return JSON.stringify({
    strings,
    values
  }, undefined, 4);
}

const what = "ram";
const where = "rama lama ding dong";

`Who put the ${what} in the ${where}?`
                            // "Who put the ram in the rama lama ding dong?"

const result = dump`Who put the ${what} in the ${where}?`;
                            // The result is `{
                            //     "strings": [
                            //         "Who put the ",
                            //         " in the ",
                            //         "?"
                            //     ],
                            //     "values": [
                            //         "ram",
                            //         "rama lama ding dong"
                            //     ]
                            //}'
