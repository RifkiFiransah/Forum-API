const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('AddThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password',
      });
      const newThread = new NewThread({
        title: 'thread',
        body: 'This is Thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addThread).toStrictEqual(
        new AddThread({
          id: 'thread-123',
          title: 'thread',
          owner: 'user-123',
        }),
      );
      expect(threads).toHaveLength(1);
    });

    it('should return add thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });
      const newThread = new NewThread({
        title: 'thread',
        body: 'This is Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addThread).toStrictEqual(
        new AddThread({
          id: 'thread-123',
          title: 'thread',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyAvailableThread', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should result thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'rifki',
      });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'thread',
        body: 'this is thread',
        date: new Date('2023-04-05T00:00:00.000Z'),
        username: 'rifki',
      });
    });
  });
});
