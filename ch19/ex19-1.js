// 연속체

function repeat(generator) {
  if (generator() !== undefined) {
    return repeat(generator);
  }
}
