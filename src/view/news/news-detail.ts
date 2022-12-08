import { Comment } from 'src/news/comments/comments.interface';
import { News } from 'src/news/news.interface';

export const renderDetailNews = (news: News, comments: Comment[]): string => {
  const countViewHtml = news.countView
    ? `<p>Количество просмотров: ${news.countView}</p>`
    : '';

  return `
        <div class="container" style="max-width: 600px; margin: 0 auto;">
            <h1>${news.title}</h1>
            <div style="display: flex; justify-content: space-between ">
                <p>Автор: ${news.author}</p>
                ${countViewHtml}
            </div>
            <img src=${
              news.cover
            } alt="news" style="width: 100%; height: 100%;" />
            <p class="mt-4">${news.description}</p>
            <div style="margin: 30px 0 0 0">
                <h5>Комментарии</h5>
                ${renderCommentsList(comments)}
            </div>
        </div>
    `;
};

const renderCommentsList = (comments: Comment[]): string => {
  let html = '';

  if (comments.length > 0) {
    html += '<ul style="margin-left: 0; padding-left: 0">';

    comments.forEach((comment) => {
      let avatarHtml = '';
      let styles =
        'margin-right: 10px; width: 32px; height: 32px; border-radius: 25px; ';

      if (comment.avatar) {
        avatarHtml = `
          <img 
            src=${comment.avatar} 
            alt="user-avatar" 
            style="${styles}"
          />`;
      } else {
        styles += `background-color: grey `;
        avatarHtml = `
          <div style="${styles}"></div>
        `;
      }

      html += `
                <li class="mb-3 mt-4" style="list-style-type: none;">
                    <div style="width: 100%; display: flex; align-items: center; margin: 0 0 10px 0; ">
                      ${avatarHtml}
                      <p style="margin: 0; ">${comment.author}</p>
                    </div>
                    <p>${comment.text}</p>
                </li>
            `;
    });

    html += '</ul>';

    return html;
  }

  return '<p class="mt-4">Комментариев пока нет. Вы можете быть первым.</p>';
};
