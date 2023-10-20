const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUnlikeUseCase = require('../LikeUnlikeUseCase');

describe('LikeUnlikeUseCase', () => {
  it('should orchestrating unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** Creating depedency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** Mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.unLikeComment = jest.fn(() => Promise.resolve(1));

    /** Creating use case instance */
    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const isLike = await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(isLike).toEqual(1);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.unLikeComment).toBeCalledWith(useCasePayload);
  });

  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** Creating depedency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** Mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.addLikeComment = jest.fn(() => Promise.resolve(1));

    /** Creating use case instance */
    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const isUnlike = await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(isUnlike).toEqual(1);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.addLikeComment).toBeCalledWith(useCasePayload);
  });
});
