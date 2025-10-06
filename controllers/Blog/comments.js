const express = require("express");
const db = require("../../db/quieries")


async function postComments(req, res){
    try{
        const postID = req.params.postID;
        const{username, content} = req.body;
        if(!postID || !username || !content){
            return res.status(400).json({error: "Post ID, username, and content are required"});
        }
        const comment = await db.postComments(postID, username, content);
        res.status(201).json(comment);

    }catch(error){
        res.status(500).json({error:" Internal server error"});
        console.error("Error posting comment", error);
    }

}

module.exports = {
    postComments
};