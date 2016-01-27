
// toggles the div containing friends list and search friends
$('#show-friends-btn').click(function() {
  $('#show-friends').fadeToggle(300);
})


// adding friend to user with AJAX call
$('.add-friend-btn').click(function(event){
  var friend_id = $(event.currentTarget).attr("value");
  // alert(friend_id);
  $.ajax({
    type: "post",
    url: 'users/friends/add/' + friend_id,
    success: function(msg) {
      console.log("success")
    },
    error: function (msg) {
      console.log("error")
    }
  })
})

//creating new venture with AJAX call
$('#go-venture-btn').click(function(){
  var location = $('#venture-location').val();
  $.ajax({
    type: "post",
    url: 'new',
    traditional: true,
    data: {location: location, venturists: venturists},
    success: function(msg) {
      console.log("BELOW is AJAX success" + venturists);
      $('#category-venture').css("display","block");
    },
    error: function(msg) {
      $('#new-venture').css("background-color","red");
    }
  })
})

// Draggable JQuery for friend-circle
$('.friend-circle').draggable({
  cursor: "move",
  containment: "#new-venture",
  snap: "#drop-box"
});

var venturists = [];
//Droppable JQuery for drop-box
var venturists = [];
$("#drop-box").droppable({
  drop: function(event, ui) {
    // console.log(event)
    // console.log(ui)
    var friend = ui.draggable;
    venturists.push(friend.attr("value"))
    // appending the circle div to drop-box
    $('#drop-box').append(friend);
    friend.remove();
    console.log(venturists);
  }
})



