import { Comment } from 'src/news/comments/comments.interface';
import { News } from 'src/news/news.interface';

export const renderDetailNews = (news: News, comments: Comment[]): string => {
  return `
        <div class="container" style="max-width: 600px; margin: 0 auto;">
            <h1>${news.title}</h1>
            <div style="display: flex; justify-content: space-between ">
                <p>Автор: ${news.author}</p>
                <p>Количество прсмотров: ${news.countView}</p>
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
      html += `
                <li class="mt-4" style="list-style-type: none;">
                    <p>${comment.author}</p>
                    <p>${comment.text}</p>
                </li>
            `;
    });

    html += '</ul>';

    return html;
  }

  return '<p class="mt-4">Комментариев пока нет. Вы можете быть первым.</p>';
};
