// 리퀘스터 팩토리

function requestorize(unary) {
  return function requestor(callback, value) {
    try {
      return callback(unary(value));
    } catch (exception) {
      return callback(undefined, exception);
    }
  };
}


function read_file(directory, encoding = "utf-8") {
  return function read_file_requestor(callback, value) {
    return fs.readFile(
      directory + value,
      encoding,
      function (err, data) {
	return (
	  err
	    ? callback(undefined, err)
	    : callback(data)
	);
      }
    );
  };
}


function factory(service_address, arguments) {

  // 팩토리 함수는 작업을 진행할 리퀘스터 함수를 반환합니다.

  return function requestor(callback, value) {

    // 작업은 처리 서비스로 메시지를 보내는 것이 실패할 경우를 대비해서 try 블록으로 시작합니다.

    try {

      // 리퀘스터 함수가 호출되면 서비스로 메시지를 보내고 작업을 시작해도 된다고 알립니다.
      // 결과 값이 나오면 이 값은 'callback' 함수를 통해 전달됩니다. 이 예시에서는 메시지
      // 시스템이 그 결과를 '(result, exception)' 순서로 전달한다고 가정합니다.

      send_message(
	callback,
	service_address,
	start,
	value,
	arguments
      );
    } catch (exception) {

      // 예외가 발생하면 실패했다는 사실을 알립니다.

      return callback(undefined, exception);
    }

    // 결과가 더 이상 필요없는 경우 요청 작업을 취소할 수 있는 'cancel' 함수를 반환합니다.

    return function cancel(reason) {
      return send_message(
	undefined,
	service_address,
	stop,
	reason
      );
    };
  };
}
