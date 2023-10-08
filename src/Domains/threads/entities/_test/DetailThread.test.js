const DetailThread = require('../DetailThread');

describe('DetailThread Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'rifki',
      date: new Date('2023-09-24 17:00:05.000000'),
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'rifki',
      date: new Date('2023-09-24 17:00:05.000000'),
      content: 123312,
      isDelete: '123',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should show DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'rifki',
      date: new Date('2023-09-24 17:00:05.000000'),
      content: 'thread',
      isDelete: true,
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.date).toEqual(payload.date.toISOString());
    expect(detailThread.content).toEqual('**komentar telah dihapus**');
  });

  it('should persist return DetailThread correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'rifki',
      date: new Date('2023-09-24 17:00:05.000000'),
      content: 'thread',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.date).toEqual(payload.date.toISOString());
    expect(detailThread.content).toEqual(payload.content);
  });
});
