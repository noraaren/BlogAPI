const prisma = require("./lib/prisma")

async function getPosts(){
    const posts = await prisma.post.findMany()
    return posts
}

async function getPostsByID(id){
    const post = await prisma.post.findUnique({
        where: {
            id: id,
        }
    })
    return post
}

async function getPostsByUserID(userId){
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId,
        }
    })
    return posts
}

async function createPost(title, content, userID){
    const post = await prisma.post.create({
        data: {
            title: title,
            content: content,
            authorId: userID
        }
    })
    return post
}

async function postComments(postID, username, content, userId = null){
    const comment = await prisma.comment.create({
        data: {
            postId: postID, 
            userId: userId,
            username: username,
            content: content
        }
    })
    return comment
}


async function deleteComment(commentID){
    const comment = await prisma.comment.delete({
        where:{
            id: commentID
        }
    })
    return comment;
}


module.exports = {
    getPosts,
    getPostsByID,
    getPostsByUserID,
    createPost,
    postComments,
    deleteComment
}
