const express = require("express");
const db = require("../../db/prisma-quieries");

async function getPostsByUserID(req, res){
    try{
        const { userID } = req.params;
        if(!userID){
            return res.status(400).json({error: "User ID is required"});
        }
        const posts = await db.getPostsByUserID(userID);
        if(!posts || posts.length === 0){
            return res.status(404).json({error: "Posts not found"});
        }
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({error: "Internal server error"});
        console.error("Error getting posts by user ID", error);
    }
}

async function updatePost(req, res){
    try{
        const {postID} = req.params;
        const {title, content} = req.body;
        if(!postID || !title || !content){
            res.status(480).json({error: "Post ID, title, and content are required"});
        }
        const updatedPost = await db.updatePost(postID, title, content);
        res.status(200).json(updatedPost);
    }catch(error){
        res.status(500).json({error: {message: error.message}});
        console.error("Error updating post", error);
    }
}


module.exports = {
    getPostsByUserID,
    updatePost
}