const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when request payload not contain needed property', () => {
    // Arrange
    const reqPayload = {
      id: 'reply-123',
      content: 'balasan',
    };

    // Action & Assert
    expect(() => new AddReply(reqPayload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when request payload not meet data type specification', () => {
    // Arrange
    const reqPayload = {
      id: true,
      content: 'balasan',
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddReply(reqPayload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when request payload not contain needed property', () => {
    // Arrange
    const reqPayload = {
      id: 'reply-123',
      content: 'balasan',
      owner: 'user-123',
    };

    // action
    const addReply = new AddReply(reqPayload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.id).toEqual(reqPayload.id);
    expect(addReply.content).toEqual(reqPayload.content);
    expect(addReply.owner).toEqual(reqPayload.owner);
  });
});
