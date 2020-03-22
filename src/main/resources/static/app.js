var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('http://localhost:8081/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/user_count', function (user_count) {
            console.log(JSON.parse(user_count.body));
            setUsers(JSON.parse(user_count.body).userCount);
        });
        stompClient.subscribe('/topic/text_message', function (message) {
            console.log(JSON.parse(message.body));
            showGreeting(JSON.parse(message.body).message);
        });

    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.unsubscribe('/topic/text_message');
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    stompClient.send("/app/text_message", {}, JSON.stringify({'message': $("#message").val()}));
}

function showGreeting(message) {
    $("#messages").append("<tr><td>" + message + "</td></tr>");
    $("#user_count").text('6')

}

function setUsers(user_count) {
    $("#user_count").text(user_count)
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#send").click(function () {
        sendMessage();
    });
});