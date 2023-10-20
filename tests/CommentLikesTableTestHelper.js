/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'like-123', commentId = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async unlikeComment(likeId) {
    const query = {
      text: 'DELETE comment_likes WHERE id = $1',
      values: [likeId],
    };
    await pool.query(query);
  },

  async findLikeCommentById(likeId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [likeId],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
