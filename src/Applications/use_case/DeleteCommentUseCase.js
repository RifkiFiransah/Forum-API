class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    await this._threadRepository.verifyAvailableThread(payload.threadId);
    await this._commentRepository.verifyCommentAccess(
      payload.id,
      payload.owner,
    );
    await this._commentRepository.deleteCommentById(payload.id);
  }

  _verifyPayload(payload) {
    const { id, threadId, owner } = payload;

    if (!id || !threadId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}
module.exports = DeleteCommentUseCase;
