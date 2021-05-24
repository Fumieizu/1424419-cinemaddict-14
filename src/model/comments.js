import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  set(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  get() {
    return this._comments;
  }

  /*  add(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comments');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType);
  }*/

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        text: comment.comment,
        emoji: comment.emotion,
        commentator: comment.author,
        commentTime: comment.date,
      },
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;
    delete adaptedComment.author;
    delete adaptedComment.date;

    return adaptedComment;
  }
}
