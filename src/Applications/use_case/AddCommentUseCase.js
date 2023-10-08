const AddComment = require('../../Domains/comments/entities/AddComment');
const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    const addComment = await this._commentRepository.addComment(newComment);
    return new AddComment(addComment);
  }
}
module.exports = AddCommentUseCase;
