const pool = require("./pool");

async function getPosts(){
    const {rows} = await pool.query("SELECT * FROM posts");
    return rows;
}

async function getPostsByID(id){
    const {rows} = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    return rows[0];
}

async function postComments(postID, username, content){
    const {rows} = await pool.query("INSERT INTO comments (post_id, username, content) VALUES ($1, $2, $3) RETURNING *", [postID, username, content]);
    return rows[0];
}


module.exports = {
    getPosts,
    getPostsByID, 
    postComments
}
