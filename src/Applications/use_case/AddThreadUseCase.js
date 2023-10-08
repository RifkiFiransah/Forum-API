const AddThread = require('../../Domains/threads/entities/AddThread');
const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    const addThread = await this._threadRepository.addThread(newThread);
    return new AddThread(addThread);
  }
}

module.exports = AddThreadUseCase;
