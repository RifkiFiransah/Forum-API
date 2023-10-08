class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._verifyPayload(threadId);
    const getThread = await this._threadRepository.getThreadById(threadId);
    const getComment = await this._commentRepository.getCommentByThreadId(threadId);
    const getReply = await this._threadRepository.getRepliesByThreadId(threadId);

    const comments = getComment.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
      replies: getReply.filter((reply) => reply.comment_id === comment.id).map((reply) => ({
        id: reply.id,
        content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      })),
    }));

    return { ...getThread, comments };
  }

  _verifyPayload(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
