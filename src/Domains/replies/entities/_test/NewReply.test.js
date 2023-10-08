const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when request payload not contain needed property', () => {
    // Arrange
    const reqPayload = {
      content: 'balasan',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewReply(reqPayload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when request payload not meet data type specification', () => {
    // Arrange
    const reqPayload = {
      commentId: true,
      content: 'balasan',
      owner: 123,
    };

    // Action & Assert
    expect(() => new NewReply(reqPayload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when request payload not contain needed property', () => {
    // Arrange
    const reqPayload = {
      commentId: 'comment-123',
      content: 'balasan',
      owner: 'user-123',
    };

    // action
    const newReply = new NewReply(reqPayload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.commentId).toEqual(reqPayload.commentId);
    expect(newReply.content).toEqual(reqPayload.content);
    expect(newReply.owner).toEqual(reqPayload.owner);
  });
});
