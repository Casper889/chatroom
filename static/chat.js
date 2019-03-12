var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
var template = Handlebars.compile(document.querySelector('#template').innerHTML);

var list = document.querySelector('#channelList');

var chatWindow = document.querySelector('#chatWindow');
var chatMessages = document.querySelector('#chatMessages');
var formTyping = document.querySelector('#formTyping');
var message = document.querySelector('#message');
var allChannels = document.querySelector('#channelList').childNodes;

{% if lastChannel %}
  for ( let j = 0; j < allChannels.length; j++){
    if (allChannels[j].innerHTML == "{{ lastChannel }}"){
      if (chatWindow.style.visibility === "hidden"){
        chatWindow.style.visibility = 'visible';
      }

      var title = document.querySelector('#title');
      title.innerHTML = "{{ lastChannel }}";
      socket.emit('update', {"channel": title.innerHTML});
    }
  }
{% endif %}

list.addEventListener('mouseenter', () => {
  allChannels = document.querySelector('#channelList').childNodes;

  if (allChannels != null){


    for (let i = 0; i < allChannels.length; i++){
      allChannels[i].onclick = () => {

        if (chatWindow.style.visibility === "hidden"){
          chatWindow.style.visibility = 'visible';
        }

        var title = document.querySelector('#title');
        title.innerHTML = allChannels[i].innerHTML;


        let request = new XMLHttpRequest;
        request.open('POST', '/lastChannel')
        request.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        request.send("lastChannel=" + title.innerHTML);

        chatMessages.innerHTML = '';
        socket.emit('update', {"channel": title.innerHTML});
        location.reload()
      }
    }
  }
});

socket.on('connect', () => {

  formTyping.onsubmit = () => {
    socket.emit('sendMessage', {"channel": title.innerHTML, "message": message.value});
    message.value = '';
    return false;
  }
});

socket.on('updateChat', function(data, name) {
  if (data != 'notFound'){
    let username = document.querySelector('#user-data').dataset.username;

    if (name == username) {
      for (var i = 0; i < data.length; i++){

        if (data[i].message != null){
          oldLi = template({"time": data[i].time, "sender": data[i].sender, "message": data[i].message});
          chatMessages.innerHTML += oldLi;
        }
      }
    }
  }else{
    chatMessages.innerHTML = '';
  }
});

socket.on('update', data => {
  newLi = template({"time": data.time, "sender": data.sender, "message": data.message});
  chatMessages.innerHTML += (newLi);
});
