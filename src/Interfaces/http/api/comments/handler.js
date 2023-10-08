const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUsecase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const { id } = request.auth.credentials;
    const payload = {
      threadId: request.params.threadId,
      content: request.payload.content,
      owner: id,
    };
    const addComment = await addCommentUsecase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment: addComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    const payload = {
      id: request.params.commentId,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    };
    await deleteCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
