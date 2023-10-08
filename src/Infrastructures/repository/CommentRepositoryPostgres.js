/* eslint-disable max-len */
/* eslint-disable quotes */

const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddComment = require('../../Domains/comments/entities/AddComment');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, owner, date, isDeleted],
    };

    const { rows } = await this._pool.query(query);

    return new AddComment(rows[0]);
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments INNER JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new InvariantError("Comment tidak tersedia");
    }

    return rows;
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return rowCount;
  }

  async verifyCommentAccess(id, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses ini');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    return { status: 'success' };
  }
}
module.exports = CommentRepositoryPostgres;
