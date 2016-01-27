//adding dotenv up at the top
// var dotenv = require('dotenv');
// dotenv.load();
var count = 0;

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

//Function for clicking a button 'yes' or 'no'.
//click yes, count 1 for that choice. Also, use counter to determine which
//venue to show when the page reloads.

$('.card').click(function(event) {
  var count = 1;
  venue_id = limit[count].id;
  //now that you have the venue_id, make a call for its picture.
  $.get('https://api.foursquare.com/v2/venues/'+ venue_id + '/photos?&client_id='+client_id+'&client_secret='+client_secret+'&v=20160126', function(error,response,data){
      if(!error) {
        //console.log(JSON.parse(response.data));
        //res.send(JSON.parse(response.body).response.photos.items[0]);
        firstPhoto = JSON.parse(response.body).response.photos.items[0];

        //res.render('ventures/photo', {firstPhoto:firstPhoto});
        res.render('ventures/show', {location: location, query: query, venues: venues, firstPhoto: firstPhoto})
      }
      else {
         res.send({venuesSearch: 'Not implemented!'});
      }
  })
  count+=1;
});

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

// var inArray = false;
// Updating venture category with AJAX call
$('.cat').click(function(event) {
  var category = $(event.currentTarget).text().toLowerCase()
  $.ajax({
    type: "patch",
    url: 'new',
    traditional: true,
    data: {keyword: category},
    success: function(msg) {
      console.log('cataagory AJAX success');
    },
    error: function(msg) {
      console.log('catagory AJAX fail' + msg);
    }
  })
})

// Adding venue ids to venture with AJAX call
$('#get-venture-btn').click(function(){
  $.ajax({
    type: "put",
    url: 'new',
    traditional: true,
    success: function(msg) {
      console.log(msg.venture_id);
      window.location.href = '/ventures/show/'+msg.venture_id
    },
    error: function(msg) {
      console.log('venue id AJAX fail');
    }
  })
})

  // var current = $(event.currentTarget);
  // current.toggle(function(){
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

  // $(event.currentTarget).text().toLowerCase()
  // categories.push(category)
  // $(event.currentTarget).css('background-color','purple')



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
    friend.remove();
    console.log(venturists);
  }
})


