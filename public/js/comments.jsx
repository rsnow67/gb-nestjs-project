const commentsWrapper = { margin: '30px 0 0 0' };

const comment = {
  listStyleType: 'none',
};

const commentWrapper = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  margin: '0 0 10px 0',
};

const avatar = {
  marginRight: '10px',
  width: '32px',
  height: '32px',
  borderRadius: '25px',
};

const deafultAvatar = {
  ...avatar,
  backgroundColor: 'grey',
};

const commentInfoInner = {
  maxWidth: '450px',
  display: 'flex',
  flexDirection: 'column',
};

const date = {
  margin: 0,
  fontSize: '12px',
};

const startEditButton = {
  position: 'absolute',
  right: 40,
  fill: '#000',
  cursor: 'pointer',
};

const removeButton = {
  position: 'absolute',
  right: 0,
  width: '0.5em',
  height: '0.5em',
};

const editForm = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
};

const updateButton = {
  marginRight: '10px',
};

const createForm = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
};

const styles = {
  commentsWrapper,
  comment,
  commentWrapper,
  avatar,
  deafultAvatar,
  commentInfoInner,
  date,
  startEditButton,
  removeButton,
  editForm,
  updateButton,
  createForm,
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const API = 'http://localhost:3000';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      currentUser: null,
      message: '',
      editableCommentId: null,
    };

    this.newsId = parseInt(window.location.href.split('/').reverse()[1]);

    this.socket = io(API, {
      query: {
        newsId: this.newsId,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + Cookies.get('authorization'),
          },
        },
      },
    });

    this.handleSetEditableCommentId =
      this.handleSetEditableCommentId.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  componentDidMount() {
    this.getAllComments();

    const currentUserId = Number(getCookie('userId'));
    this.getUser(currentUserId);

    cookieStore.addEventListener('change', ({ changed }) => {
      for (const { name, value } of changed) {
        if (name === 'userId') {
          this.getUser(Number(value));
        }
      }
    });

    this.socket.on('newComment', (comment) => {
      this.setState((prevState) => ({
        comments: [...prevState.comments, comment],
      }));
    });

    this.socket.on('updateComment', (payload) => {
      const { updatedComment } = payload;
      const { comments } = this.state;
      const nextComments = comments.map((comment) => {
        return comment.id === updatedComment.id ? updatedComment : comment;
      });

      this.setState({
        comments: nextComments,
      });
    });

    this.socket.on('removeComment', (payload) => {
      const { id: removedCommentId } = payload;

      this.setState((prevState) => ({
        comments: prevState.comments.filter(
          (comment) => comment.id !== removedCommentId,
        ),
      }));
    });
  }

  getAllComments = async () => {
    const response = await fetch(`${API}/comments/${this.newsId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const comments = await response.json();

      this.setState({ comments });
    }
  };

  getUser = async (userId) => {
    const response = await fetch(`${API}/users/${userId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const user = await response.json();

      this.setState({ currentUser: user });
    }
  };

  handleRemoveClick = (id) => {
    fetch(`${API}/comments/${id}`, { method: 'DELETE' });
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleSubmit = () => {
    this.socket.emit('addComment', {
      newsId: this.newsId,
      text: this.state.message,
    });
    this.setState({ message: '' });
  };

  handleSetEditableCommentId = (id) => {
    this.setState({ editableCommentId: id });
  };

  renderEmptyList() {
    return (
      <p className="mt-4">Комментариев пока нет. Вы можете быть первым.</p>
    );
  }

  renderComments() {
    const { comments, currentUser = {}, editableCommentId } = this.state;

    return comments.map((comment) => {
      const {
        createdAt,
        updatedAt,
        id: commentId,
        user: { avatar, nickName, id: userId },
        text,
      } = comment;

      const createdAtDate = new Date(createdAt);
      const isCommentUpdated = createdAt !== updatedAt;
      const updatedAtDate = isCommentUpdated ? new Date(updatedAt) : null;

      const showEditButton =
        currentUser &&
        userId === currentUser.id &&
        editableCommentId !== commentId;

      const showRemoveButton =
        currentUser &&
        (userId === currentUser.id || currentUser.roles === 'admin') &&
        editableCommentId !== commentId;

      return (
        <li key={commentId} className="mb-3 mt-4" style={styles.comment}>
          <div style={styles.commentWrapper}>
            {avatar ? (
              <img src={avatar} alt="user-avatar" style={styles.avatar} />
            ) : (
              <div style={styles.defaultAvatar}></div>
            )}
            <div style={styles.commentInfoInner}>
              <p style={{ margin: 0 }}>{nickName}</p>
              <p style={styles.date}>{createdAtDate.toLocaleString()}</p>
              {isCommentUpdated ? (
                <p style={styles.date}>
                  Изменено: {updatedAtDate.toLocaleString()}
                </p>
              ) : null}
            </div>
            {showEditButton ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil"
                viewBox="0 0 16 16"
                style={styles.startEditButton}
                onClick={() => this.handleSetEditableCommentId(commentId)}
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
            ) : null}
            {showRemoveButton ? (
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                style={styles.removeButton}
                onClick={() => this.handleRemoveClick(commentId)}
              ></button>
            ) : null}
          </div>
          {editableCommentId === commentId ? (
            <EditCommentForm
              defaultValue={text}
              commentId={commentId}
              onSetEditableCommentId={this.handleSetEditableCommentId}
            />
          ) : (
            <p>{text}</p>
          )}
        </li>
      );
    });
  }

  render() {
    const { comments, message } = this.state;

    return (
      <div style={styles.commentsWrapper}>
        <h5>Комментарии:{comments.length}</h5>
        {comments.length > 0 ? this.renderComments() : this.renderEmptyList()}
        <form
          className="mt-4"
          id="create-comment-form"
          style={styles.createForm}
        >
          <textarea
            className="form-control"
            name="text"
            id="textInput"
            rows="3"
            placeholder="Написать комментарий"
            required
            value={message}
            onChange={this.handleChange}
          ></textarea>
          <button
            className="btn btn-primary mt-3"
            type="button"
            onClick={this.handleSubmit}
          >
            Отправить
          </button>
        </form>
      </div>
    );
  }
}

class EditCommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: props.defaultValue,
    };
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleSubmit = async () => {
    const { message } = this.state;

    if (message.length === 0) {
      return;
    }

    const response = await fetch(`${API}/comments/${this.props.commentId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });

    if (response.ok) {
      this.handleCloseForm();
    }
  };

  handleCloseForm = () => {
    this.props.onSetEditableCommentId(null);
  };

  render() {
    return (
      <form className="mt-4" id="edit-comment-form" style={styles.editForm}>
        <textarea
          className="form-control"
          name="message"
          id="messageInput"
          rows="3"
          placeholder="Написать комментарий"
          required
          value={this.state.message}
          onChange={this.handleChange}
        ></textarea>
        <button
          className="btn btn-primary mt-3"
          type="button"
          onClick={this.handleSubmit}
          style={styles.updateButton}
        >
          Сохранить
        </button>
        <button
          className="btn btn-primary mt-3"
          type="button"
          onClick={this.handleCloseForm}
        >
          Отменить
        </button>
      </form>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(React.createElement(Comments), root);
