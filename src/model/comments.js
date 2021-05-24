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

  add(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const count = this._comments.length;
    this._comments = this._comments.filter((comment) => comment.id !== update);

    if (count === this._comments.length) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._notify(updateType);
  }

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

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'author': comment.commentator,
        'comment': comment.text,
        'date': comment.commentTime,
        'emotion': comment.emoji,
      },
    );

    delete adaptedComment.commentator;
    delete adaptedComment.text;
    delete adaptedComment.commentTime;
    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
