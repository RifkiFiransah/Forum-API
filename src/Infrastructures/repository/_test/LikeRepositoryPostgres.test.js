const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  const payloadUser = {
    id: 'user-123',
    username: 'dicoding',
  };

  const payloadThread = {
    id: 'thread-123',
    owner: 'user-123',
  };

  const payloadComment = {
    id: 'comment-123',
    owner: 'user-123',
  };

  it('should be instance of likeUnlikeRepository domain', () => {
    // arrange
    const likeUnlikeRepository = new LikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(likeUnlikeRepository).toBeInstanceOf(LikeRepositoryPostgres);
  });

  describe('behaviour test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser(payloadUser);
      await ThreadsTableTestHelper.addThread(payloadThread);
      await CommentsTableTestHelper.addComment(payloadComment);
    });

    afterEach(async () => {
      await CommentLikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentLikesTableTestHelper.cleanTable();
    });

    describe('addLikeComment method', () => {
      it('should add like to comment', async () => {
        // arrange
        const payload = {
          commentId: payloadComment.id,
          userId: payloadUser.id,
        };
        const fakeIdGenerator = () => '123';
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const isLike = await likeRepositoryPostgres.addLikeComment(payload);

        expect(isLike).toBeTruthy();
      });
    });

    describe('verifyAvailableLike', () => {
      it('should verify if comment is liked', async () => {
        // arrange
        const payload = {
          commentId: payloadComment.id,
          userId: payloadUser.id,
        };
        await CommentLikesTableTestHelper.addCommentLike({
          id: 'like-123',
          commentId: payloadComment.id,
          owner: payloadUser.id,
        });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const isLike = await likeRepositoryPostgres.verifyAvailableLike(payload);

        // Assert
        expect(isLike).toBeTruthy();
      });

      it('should return false if comment is not liked', async () => {
        // arrange
        const payload = {
          commentId: payloadComment.id,
          userId: payloadUser.id,
        };
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const isLike = await likeRepositoryPostgres.verifyAvailableLike(payload);

        // Assert
        expect(isLike).toBeFalsy();
      });
    });

    describe('unlikeComment method', () => {
      it('should unlike comment ', async () => {
        // Arrange
        const payload = {
          commentId: payloadComment.id,
          userId: payloadUser.id,
        };
        await CommentLikesTableTestHelper.addCommentLike({
          id: 'like-123',
          commentId: payloadComment.id,
          owner: payloadUser.id,
        });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const isUnlike = await likeRepositoryPostgres.unLikeComment(payload);

        // Assert
        expect(isUnlike).toBeTruthy();
      });
    });

    describe('getLikeCountComment Method', () => {
      it('should return like count', async () => {
        // Arrange
        const payload = {
          threadId: payloadThread.id,
          commentId: payloadComment.id,
          userid: payloadUser.id,
        };

        await UsersTableTestHelper.addUser({
          id: 'user-101',
          username: 'Rifki',
        });

        await CommentLikesTableTestHelper.addCommentLike({
          id: 'like-123',
          commentId: payloadComment.id,
          owner: payloadUser.id,
        });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const getLike = await likeRepositoryPostgres.getLikeCountComment(payload.commentId);

        // assert
        expect(getLike).toStrictEqual(1);
      });
    });
  });
});
