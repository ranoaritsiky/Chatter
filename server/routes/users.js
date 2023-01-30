var express = require('express');
var router = express.Router();
const prisma = require('../db/prisma')



/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.send(users)
})

/* POST users listing. */
router.post('/create_user', async(req, res) => {
  const { name, email, password } = req.body

  // check if email does not exist yet
  const haveEmail = await prisma.user.findMany(
    {
      where: {
        email : email
      }
    }
  )
  if (haveEmail.length > 0) {
    res.status(400).json({
      status: "Failed",
      message:"Email already exist"
    })
  }
  else {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password
      }
    })
      res.status(200).json({
        status: "Success",
        message :"User was created successfuly"
        
      })
    
  }

})


module.exports = router;
