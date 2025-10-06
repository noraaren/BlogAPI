const pool = require("./pool");

async function getPosts(){
    const {rows} = await pool.query("SELECT * FROM posts");
    return rows;
}

async function getPostsByID(id){
    const {rows} = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    return rows[0];
}

async function getPostsByUserID(userId){
    const { rows } = await pool.query(
        "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return rows;
}

async function postComments(postID, username, content){
    const {rows} = await pool.query("INSERT INTO comments (post_id, username, content) VALUES ($1, $2, $3) RETURNING *", [postID, username, content]);
    return rows[0];
}

async function deleteComment(commentId){
    const { rows } = await pool.query(
        "DELETE FROM comments WHERE id = $1 RETURNING *",
        [commentId]
    );
    return rows[0] || null;
}

async function updatePost(postID, title, content){
    const { rows } = await pool.query(
        "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
        [title, content, postID]
    );
    return rows[0] || null;
}


module.exports = {
    getPosts,
    getPostsByID, 
    getPostsByUserID,
    postComments,
    deleteComment, 
    updatePost
}
