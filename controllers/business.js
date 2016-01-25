var Business = require('../models/business')
//venture is fully CRUD-able
module.exports = {

  show: function(req, res, next) {
    Business.findOne({_id: Number(req.params.id)} , function(err, business) {
      //Above, this will set the user_id equal to the user_id of the first
      //user in the business array, i.e. you.
      res.render('ventures/show', {business: business})
    })
  },
  update: function(req, res, next) {
    Business.findOneAndUpdate({_id: Number(req.params.id)},
      req.body, function(err, business){
        if(err) console.log(err)
          res.send("Business updated!")
    })
  }
}
