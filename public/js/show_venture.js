// AJAX adding votes

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

// AJAX for calculate & show-ranking
$('#show-ranking-btn').click(function(){
  var ventureId = $('#show-venture').attr("value");
  $.ajax({
    type: 'get',
    url: '/ventures/get_ranking',
    traditional: true,
    data: {venture_id: ventureId},

    success: function(msg) {
      var sorted = [];
      for(var key in msg) {
        if(msg.hasOwnProperty(key)) {
          obj = msg[key]
          for(var prop in obj) {
            ven_id = prop;
            console.log(ven_id)
            sorted.push([prop,obj[prop]])
          }
        }
      sorted = sorted.sort(function(a, b){return b[1]-a[1]})
        // if(sorted[0] == obj[prop]) {
        console.log(prop)
        // }
        console.log(sorted)

      }


    $('.venue-name').each(function (i, el) {
        if ($(el).data('id') == sorted[0][0]) {
          $('#rank').html('<h3>'+$(el).html()+'</h3>')
        }
      });

    },
    error: function(msg) {
      console.log("AJAX for rankig failure");
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

// Stopping Auto Carousel
$('#myCarousel').carousel('pause')

