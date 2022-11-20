import { News } from '../../news/news.interface';

export const renderNewsAll = (news: News[]): string => {
  let newsListHtml = '';

  news.forEach((news) => {
    newsListHtml += renderNewsBlock(news);
  });

  return `
    <h1>Список новостей</h1>
    <div class="row">
        ${newsListHtml}
    </div>
    `;
};

export const renderNewsBlock = (news: News) => {
  return `
    <div class="col-lg-4 mb-4">
        <div class="card">
            <img src=${news.cover} class="card-img-top" alt="cat" style="height: 200px; object-fit: cover" />
            <div class="card-body">
                <h5 class="card-title">${news.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
                <p class="card-text">${news.description}</p>
            </div>
        </div>  
    </div>
    `;
};
