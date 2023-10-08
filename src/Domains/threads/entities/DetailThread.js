class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date.toISOString();
    // this.isDelete = payload.isDelete;
    this.content = payload.isDelete ? '**komentar telah dihapus**' : payload.content;
  }

  _verifyPayload(payload) {
    const {
      id,
      username,
      date,
      content,
      // isDelete,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
