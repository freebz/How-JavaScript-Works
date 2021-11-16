// WeakMap

const secret_key = new WeakMap();
secret_key.set(object, secret);

secret = secret_key.get(object);


function sealer_factory() {
  const weakmap = new WeakMap();
  return {
    sealer(object) {
      const box = Object.freeze(Object.create(null));
      weakmap.set(box, object);
      return box;
    },
    unsealer(box) {
      return weakmap.get(box);
    }
  };
}
