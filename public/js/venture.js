
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
      // $('#category-venture').css("display","block");
    },
    error: function(msg) {
      $('#new-venture').css("background-color","red");
    }
  })
})

var categories = [];
var inArray = false;
// Updating venture category with AJAX call
$('.cat').click(function(event) {
  // var current = $(event.currentTarget);
  // current.toggle(function(){

  })
  // current.toggle("slow", function() {
  //   if(inArray === false) {
  //     categories.push(current.text().toLowerCase())
  //     current.css('background-color', 'purple')
  //     inArray = true;
  //   }else{
  //     var indexNum = categories.indexOf(current)
  //     categories.splice(indexNum, 1)
  //     current.css('background-color', none)
  //     inArray = false;
  //   }
  })
  // $(event.currentTarget).text().toLowerCase()
  // categories.push(category)
  // $(event.currentTarget).css('background-color','purple')
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



