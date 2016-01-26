
// toggles the div containing friends list and search friends
$('#add-friend').click(function() {
  $('#show-friends').fadeToggle(300);
})

$('.add-friend-btn').click(function(event){
  var friend_id = $(event.currentTarget).attr("value");
  $.ajax('/users/friends/add/' + friend_id);
})
