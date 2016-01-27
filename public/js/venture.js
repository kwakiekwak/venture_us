
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

// Draggable JQuery for friend-circle
$('.friend-circle').draggable({
  cursor: "move",
  containment: "#new-venture",
  snap: "#drop-box"
});

var venturists = [];
//Droppable JQuery for drop-box
$("#drop-box").droppable({
  drop: function(event, ui) {
    // console.log(event)
    // console.log(ui)
    var friend = ui.draggable;
    // pushing into the array
    venturists.push(friend.attr("value"))
    // appending the circle div to drop-box
    $('#drop-box').append(friend);
    friend.remove();
    console.log(venturists);
  }
})

//creating new venture with AJAX call
$('#go-venture-btn').click(function(){
  var location = $('#venture-location').val();
  $.ajax({
    type: "post",
    // dataType: "json",
    url: 'new',
    data: {location: location, user_id: JSON.stringify(venturists)},
    success: function(msg) {
      $('#category-venture').css("background-color","black");
    },
    error: function(msg) {
      if(msg) console.log(msg)
      $('#category-venture').css("background-color","red");
    }
  })
})

