const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('AddComment Function', () => {
    it('should persist add thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'secret',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'This is content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(
        addComment.id,
      );
      expect(addComment).toStrictEqual(
        new AddComment({
          id: 'comment-123',
          content: 'This is content',
          owner: 'user-123',
        }),
      );
      expect(comment).toHaveLength(1);
      expect(comment[0].is_deleted).toEqual(false);
    });

    it('should return add comment correctlty', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'secret',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'This is content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addComment).toStrictEqual(
        new AddComment({
          id: 'comment-123',
          content: 'This is content',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyAvailableComment', () => {
    it('should throw NotFoundError when comments are not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );

      // Action & Assert
      expect(
        commentRepositoryPostgres.verifyAvailableComment(
          'comment-123',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment are available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'secret',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'first comment',
        date: new Date('2023-04-13T00:00:00.000Z'),
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(
          'comment-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentAccess', () => {
    it('should throw NotfoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-789'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when credentialId not match owner column', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-789'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError or InvariantError when credentialId match owner column', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'),
      ).resolves.not.toThrow(NotFoundError);
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should throw InvariantError when threadId not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action Assert
      expect(commentRepositoryPostgres.getCommentByThreadId('thread-123'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when threadId is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'user-123', password: 'secret' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action && Assert
      await expect(commentRepositoryPostgres.getCommentByThreadId('thread-123')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(
        commentRepositoryPostgres.deleteCommentById('comment-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return success and update is_deleted column property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.deleteCommentById(
        'comment-123',
      );

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(
        'comment-123',
      );
      expect(result.status).toEqual('success');
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toEqual('comment-123');
      expect(comment[0].is_deleted).toEqual(true);
    });
  });
});
