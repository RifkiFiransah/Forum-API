const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const payload = {
      threadId,
      commentId,
      content,
      owner: id,
    };
    const addReply = await addReplyUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedReply: addReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const payload = {
      id: replyId,
      threadId,
      commentId,
      owner: id,
    };
    await deleteReplyUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        payload,
      },
    });
    return response;
  }
}
module.exports = RepliesHandler;
