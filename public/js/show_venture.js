// Click AJAX

$('.vote-btns').click(function(event) {
  var voteResult = $(event.currentTarget).attr("value");
  var venueId = $(event.currentTarget).attr("id");
  var ventureId = $('#show-venture').attr("value");
  $.ajax({
    type: "put",
    url: '/ventures/add_vote',
    traditional: true,
    data: {vote: voteResult, venue_id: venueId, venture_id: ventureId},
    success: function(msg) {
      console.log("AJAX for voting success");
    },
    error: function(msg) {
      console.log("AJAX for voting failure");
    }
  })
})


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


//Function for clicking a button 'yes' or 'no'.
//click yes, count 1 for that choice. Also, use counter to determine which
//venue to show when the page reloads.


// var count = 0;

// $('.card').click(function(event) {
//   var count = 1;
//   venue_id = limit[count].id;
//   //now that you have the venue_id, make a call for its picture.
//   $.get('https://api.foursquare.com/v2/venues/'+ venue_id + '/photos?&client_id='+client_id+'&client_secret='+client_secret+'&v=20160126', function(error,response,data){
//       if(!error) {
//         //console.log(JSON.parse(response.data));
//         //res.send(JSON.parse(response.body).response.photos.items[0]);
//         firstPhoto = JSON.parse(response.body).response.photos.items[0];

//         //res.render('ventures/photo', {firstPhoto:firstPhoto});
//         res.render('ventures/show', {location: location, query: query, venues: venues, firstPhoto: firstPhoto})
//       }
//       else {
//          res.send({venuesSearch: 'Not implemented!'});
//       }
//   })
//   count+=1;
// });
