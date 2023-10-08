const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread',
      body: 'this is thread',
      owner: 'user-123',
    };

    const expectedAddThread = new AddThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: '2023-04-05T09:58:40.000Z',
      owner: useCasePayload.owner,
    });

    /** Creating depedency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** Mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise
      .resolve(
        new AddThread(
          {
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            date: '2023-04-05T09:58:40.000Z',
            owner: useCasePayload.owner,
          },
        ),
      ));

    /** Creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addThread).toStrictEqual(expectedAddThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
