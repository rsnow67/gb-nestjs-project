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
  display: 'flex',
  flexDirection: 'column',
};

const date = {
  margin: 0,
  fontSize: '12px',
};

const removeButton = {
  position: 'absolute',
  right: 0,
  width: '0.5em',
  height: '0.5em',
};

const styles = {
  commentsWrapper,
  comment,
  commentWrapper,
  avatar,
  deafultAvatar,
  commentInfoInner,
  date,
  removeButton,
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
      message: '',
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

    this.renderComments = this.renderComments.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  componentDidMount() {
    this.getAllComments();

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

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleRemoveClick = (id) => {
    console.log('id', id);
    fetch(`${API}/comments/${id}`, { method: 'DELETE' });
  };

  handleSubmit = () => {
    this.socket.emit('addComment', {
      newsId: this.newsId,
      text: this.state.message,
    });
    this.setState({ message: '' });
  };

  renderEmptyList() {
    return (
      <p className="mt-4">Комментариев пока нет. Вы можете быть первым.</p>
    );
  }

  renderComments() {
    const currentUserId = Number(getCookie('userId'));

    return this.state.comments.map((comment) => {
      const {
        createdAt,
        updatedAt,
        id,
        user: { avatar, nickName, id: userId },
        text,
      } = comment;

      const createdAtDate = new Date(createdAt);
      const isCommentUpdated = comment.createdAt !== updatedAt;
      const updatedAtDate = isCommentUpdated ? new Date(updatedAt) : null;

      return (
        <li key={id} className="mb-3 mt-4" style={styles.comment}>
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
            {userId === currentUserId ? (
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                style={styles.removeButton}
                onClick={() => this.handleRemoveClick(id)}
              ></button>
            ) : null}
          </div>
          <p>{text}</p>
        </li>
      );
    });
  }

  render() {
    return (
      <div style={styles.commentsWrapper}>
        <h5>Комментарии:{this.state.comments.length}</h5>
        {this.state.comments.length > 0
          ? this.renderComments()
          : this.renderEmptyList()}
        <form className="mt-4" id="create-comment-form">
          <textarea
            className="form-control"
            name="text"
            id="textInput"
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
          >
            Отправить
          </button>
        </form>
      </div>
    );
  }
}

const root = document.getElementById('app');
ReactDOM.render(React.createElement(Comments), root);
