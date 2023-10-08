const AddReply = require('../../Domains/replies/entities/AddReply');
const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newReply = new NewReply(payload);
    await this._threadRepository.verifyAvailableThread(payload.threadId);
    await this._commentRepository.verifyAvailableComment(payload.commentId);
    const addReply = await this._replyRepository.addReply(newReply);

    return new AddReply(addReply);
  }
}

module.exports = AddReplyUseCase;
