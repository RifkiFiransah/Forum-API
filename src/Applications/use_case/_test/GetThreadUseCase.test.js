/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-undef */

const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // arrange
    const threadId = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'thread',
      body: 'This is thread',
      date: '2023',
      username: 'rifki',
    };

    const expectedComment = [{
      id: 'comment-123',
      username: 'rifki',
      date: '2023',
      content: 'This is content',
      is_deleted: false,
    }];

    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'user-123',
        date: '2023',
        content: 'this is comment',
        comment_id: 'comment-123',
        is_deleted: false,
      },
    ];

    const mapComments = expectedComment.map(({ is_deleted: deleteComment, ...otherProperties }) => otherProperties);
    const mapReplies = expectedReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);

    const expectedCommentAndReplies = [
      {
        ...mapComments[0],
        replies: mapReplies,
      },
    ];

    /** Creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** Mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectedComment));
    mockThreadRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectedReplies));

    const mockGetThreadUseCase = new GetThreadUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository });

    // Action
    const getThread = await mockGetThreadUseCase.execute(threadId);

    // Assert
    expect(getThread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith(threadId);
  });

  it('should not display deleted comment', async () => {
    // Arrange
    const getThreadUseCasePayload = {
      threadId: 'thread-123',
    };

    const expectThread = {
      id: 'thread-123',
      title: 'thread',
      body: 'this is thread',
      date: '2023',
      username: 'user-123',
    };

    const expectComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2023',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const expectReplies = [
      {
        id: 'reply-123',
        username: 'user-123',
        date: '2023',
        content: '**balasan telah dihapus**',
        comment_id: 'comment-123',
        is_deleted: true,
      },
    ];

    const mappedComments = expectComments.map(({ is_deleted: deleteComment, ...otherProperties }) => otherProperties);
    const mappedReplies = expectReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);

    const expectCommentsAndReplies = [
      {
        ...mappedComments[0],
        replies: mappedReplies,
      },
    ];

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectThread));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectComments));
    mockThreadRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectReplies));

    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await mockGetThreadUseCase.execute(getThreadUseCasePayload.threadId);

    // Assert
    expect(getThread).toStrictEqual({
      ...expectThread,
      comments: expectCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
  });

  it('should throw error if use case payload not contain threadId', async () => {
    // Arrange
    const getThreadUseCasePayload = new GetThreadUseCase({}, {});

    // Action & Assert
    await expect(getThreadUseCasePayload.execute())
      .rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if threadId not string', async () => {
    // Arrange
    const threadId = 123;
    const getThreadUseCasePayload = new GetThreadUseCase({}, {});

    // Action & Assert
    await expect(getThreadUseCasePayload.execute(threadId))
      .rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
