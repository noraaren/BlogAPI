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


async function deleteComment(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Comment ID is required" });
  
      const deleted = await db.deleteComment(id);
      if (!deleted) return res.status(404).json({ error: "Comment not found" });
  
      res.status(200).json(deleted);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  

module.exports = {
    postComments, 
    deleteComment
};