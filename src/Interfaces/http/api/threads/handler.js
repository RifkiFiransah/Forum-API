const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.putLikeUnlikeHandler = this.putLikeUnlikeHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id } = request.auth.credentials;
    const { title, body } = request.payload;
    const useCasePayload = {
      title,
      body,
      owner: id,
    };

    const addThread = await addThreadUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread: addThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const getThread = await getThreadUseCase.execute(request.params.threadId);
    return {
      status: 'success',
      data: {
        thread: getThread,
      },
    };
  }

  async putLikeUnlikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;
    const likeUnlikeUseCase = this._container.getInstance(LikeUnlikeUseCase.name);
    const useCasePayload = {
      threadId,
      commentId,
      userId: id,
    };
    await likeUnlikeUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
