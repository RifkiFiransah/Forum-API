class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId);
    await this._commentRepository.verifyAvailableComment(payload.commentId);

    const like = await this._likeRepository.verifyAvailableLike(payload);

    if (like > 0) {
      return this._likeRepository.unLikeComment(payload);
    }
    return this._likeRepository.addLikeComment(payload);
  }
}

module.exports = LikeUnlikeUseCase;
