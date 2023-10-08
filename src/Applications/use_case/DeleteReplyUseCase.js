class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    await this._threadRepository.verifyAvailableThread(payload.threadId);
    await this._commentRepository.verifyAvailableComment(payload.commentId);
    await this._replyRepository.verifyReplyAccess(payload.id, payload.owner);
    await this._replyRepository.deleteReplyById(payload.id);
  }

  _verifyPayload(payload) {
    const {
      id,
      commentId,
      threadId,
      owner,
    } = payload;

    if (!id || !commentId || !threadId || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}
module.exports = DeleteReplyUseCase;
