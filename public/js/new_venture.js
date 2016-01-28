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
    url: '/users/add_friend/' + friend_id,
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
    // dataType: 'json',
    // async: false,
    traditional: true,
    data: {location: location, venturists: venturists, category: category},
    success: function(msg) {
      console.log("hi");
      window.location.href= '/ventures/show/'+msg.venture_id

    },
    error: function(msg) {
      $('#new-venture').css("background-color","red");
    }
  })
})

var category;

var x = document.getElementsByClassName('cat')
console.log(x)
for(var i=0; i<x.length; i++) {
  x[i].addEventListener('click', function() {
    var selectedEl = document.querySelector('.selected')
    if(selectedEl) {
      selectedEl.classList.remove("selected")
    }
    this.classList.add("selected")
    // console.log(this)
    // console.log(this.innerHTML)
    category = this.innerHTML
    console.log(category)
  }, false)
}


// Draggable JQuery for friend-circle
$('.friend-circle').draggable({
  cursor: "move",
  containment: "#new-venture",
  snap: "#drop-box"
});


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
    // friend.remove();
    console.log(venturists);
  }
})

