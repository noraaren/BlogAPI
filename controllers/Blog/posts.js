const db = require("../../db/quieries")

async function getPosts(req, res){
    try{
        const posts = await db.getPosts();
        res.json(posts);
    }catch(error){
        res.status(500).json({error: error.message});
        console.error("Error getting posts", error);
    }

}

async function getPostsByID(req, res){
    try{
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({error: 'Post ID is required'});
        }
        
        const post = await db.getPostsByID(id);
        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }
        
        res.json(post);
    }catch(error){
        res.status(500).json({error: error.message});
        console.error("Error getting post by ID", error);
    }
}




module.exports = {
    getPosts,
    getPostsByID
}