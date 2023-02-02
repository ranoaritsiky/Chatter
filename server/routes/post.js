const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

var express = require('express')
const router = express.Router()

const getId = async (authorId) => {
    return await prisma.user.findUnique({
        where: {
            id : authorId
        }
    })
}

const findId = async (id) => {
    return await prisma.post.findUnique({
        where:{
            id:id
        }
    })
}

router.post('/chatter', async(req, res) => {
    const { content, authorId } = req.body
    // find author if it exist
    const isIdExist = await getId(authorId);
    if (isIdExist) {
        const post = await prisma.post.create({
            data: {
                authorId,
                content
            }
        })
        res.status(200).json({
            message: 'The post was send',
        })
    }
    else {
        res.status(500).json({
            message:'User does not exist'
        })
    }
    
})

router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany()
        res.status(200).json({
            posts:posts
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

router.put('/update_post', async (req, res) => {
    const { id, content } = req.body
    
    const isId = await findId(id)
    
    if (isId) {
        try {
            await prisma.post.update({
                where: {
                    id:id
                },
                data: {
                    content:content
                }
            })
            res.status(200).json({
                message: 'Update success'
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

})

router.delete('/delete_post', async (req, res) => {
    const { id } = req.body

    const isId = await findId(id)

    if (isId) {
        try {
            await prisma.post.delete({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: 'Deleted post'
            })
            }
        catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

})

module.exports = router