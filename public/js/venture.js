
// toggles the div containing friends list and search friends
$('#show-friends-btn').click(function() {
  $('#show-friends').fadeToggle(300);
})

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

// Add event listener for clicking 'submit' button for Foursquare query
//When you click venue-search button, we want to push the top 20 options
//for that location + query into the venture.choice array.
//We are then going to render that array on the show page, using its
//venue.id and venue.photos, venue.name, venue.location.address

// function addToVenture() {
//   venue.choice.push()
// }
