const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
var router = express.Router();

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
}

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

router.put('/update_user', async (req, res) => {
  const { email, name } = req.body
  
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(404).json({
      error: 'User not found'
    });
  } else {
    await prisma.user.update({
      where: {
        email: email
      },
      data:{
        name :name
      }
    })
    res.status(200).json({
      message: 'User was updated successfuly'
    })
  }
  
})

router.delete('/delete_user', async (req, res) => {
  const {email} = req.body
  const user = await getUserByEmail(email);

  if (!user) {
    res.status(404).json({
      error: 'User not found'
    });
  } else {
    await prisma.user.delete({
      where: {
        email: email
      }
    })
    res.status(200).json({
      message: 'User was deleted successfuly'
    })
  }

  })




module.exports = router;
