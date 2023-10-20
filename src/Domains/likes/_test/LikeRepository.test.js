const LikeRepository = require('../LikeRepository');

describe('LikeRepository Interface', () => {
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.addLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.verifyAvailableLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.unLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
