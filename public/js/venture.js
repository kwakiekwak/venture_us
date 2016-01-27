//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();
var count = 0;

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
