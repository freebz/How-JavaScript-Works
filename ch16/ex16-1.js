// this

const new_object = Object.create(old_object);


old_object.bud = function bud() {
  const that = this;

  // lou 함수는 hud 메서드의 this는 볼 수 없지만, bud 메서드의 that은 볼 수 있습니다.

  function lou() {
    do_it_to(that);
  }
  lou();
};


new_object.bud();


const funky = new_object.bud;
funky();


function pubsub() {

  // pubsub 팩토리는 게시자/구독자 객체를 만듭니다. 해당 객체에 대한 접근 권한을 가진
  // 코드는 게시 내용을 받을 수 있는 구독 함수를 사용할 수 있으며, 또한 어떤 내용을
  // 게시해서 다른 모든 구독자에게 전달할 수도 있습니다.

  // subscribers 배열은 구독 함수를 저장하는 데 사용됩니다. pubsub 함수 스코프에
  // 위치하기 때문에 바깥에서는 보이지 않습니다.

  const subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      const length = subscribers.length;
      for (let i = 0; i < length; i += 1) {
	subscribers[i](publication); // 주의: 배열에 대한 메서드 호출
      }
    }
  };
}


// 구독자를 삭제하거나 메시지를 훔쳐보거나 나쁜 일을 할 수 있음
my_pubsub.subscribe(function (publication) {
  this.length = 0;
});


function pubsub() {
  const subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      subscribers.forEach(function (subscribers) {
	subscriber(publication);
      }
    }
  };
}
