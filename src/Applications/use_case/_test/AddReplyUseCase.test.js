const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const reqPayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      content: 'balasan',
      owner: 'user-123',
    };

    const expectedAddReply = new AddReply({
      id: 'reply-123',
      comment_id: reqPayload.commentId,
      owner: reqPayload.owner,
      content: reqPayload.content,
      date: '2023-04-05T09:58:40.000Z',
      is_deleted: false,
    });

    /** Creating depedency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    /** Mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(
      new AddReply({
        id: 'reply-123',
        comment_id: reqPayload.commentId,
        owner: reqPayload.owner,
        content: reqPayload.content,
        date: '2023-04-05T09:58:40.000Z',
        is_deleted: false,
      }),
    ));

    /** Creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addReply = await addReplyUseCase.execute(reqPayload);

    // Assert
    expect(addReply).toStrictEqual(expectedAddReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(reqPayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(reqPayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        threadId: reqPayload.threadId,
        commentId: reqPayload.commentId,
        content: reqPayload.content,
        owner: reqPayload.owner,
      }),
    );
  });
});
