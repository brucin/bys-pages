// Homepage-only presentation update. No forms, accounts, analytics or network APIs.
const screenCopy = {
  'zh-cn': [
    ['首页 · 拉风箱', '跟随动作示范，开始今天的练习。'],
    ['嗨，白小生', '从一个问题，到一次练习与回看。'],
    ['训练历史', '留下每次练习，也留下身体的感受。']
  ],
  'zh-tw': [
    ['首頁 · 拉風箱', '跟隨動作示範，開始今天的練習。'],
    ['嗨，白小生', '從一個問題，到一次練習與回看。'],
    ['訓練歷史', '留下每次練習，也留下身體的感受。']
  ],
  en: [
    ['The Bellows', 'Explore the movement, then begin your practice.'],
    ['Hi, Bai Xiaosheng', 'Ask, practise and reflect in one conversation.'],
    ['Training history', 'Revisit each practice and the way it felt.']
  ]
};
const kinds = ['home', 'chat', 'history'];
const observer = new MutationObserver(updatePreview);
function observe() {
  observer.observe(document.documentElement, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ['lang', 'src', 'href']
  });
}
function updatePreview() {
  const gallery = document.querySelector('#app-preview .app-screens');
  if (!gallery) return;
  const pathLanguage = location.pathname.split('/')[1];
  const language = screenCopy[pathLanguage] ? pathLanguage : 'en';
  observer.disconnect();
  gallery.querySelectorAll('figure').forEach((figure, index) => {
    if (index >= kinds.length) return;
    const image = figure.querySelector('img');
    const link = figure.querySelector('a');
    const caption = figure.querySelector('figcaption');
    if (!image || !link || !caption) return;
    const [title, description] = screenCopy[language][index];
    const src = `/assets/screens/iphone-20261029/${kinds[index]}-${language}.webp`;
    image.setAttribute('src', src);
    image.setAttribute('alt', title);
    image.setAttribute('width', '856');
    image.setAttribute('height', '1852');
    image.setAttribute('decoding', 'async');
    link.setAttribute('href', src);
    link.setAttribute('aria-label', title);
    link.classList.add('iphone-preview');
    caption.textContent = title;
    caption.dataset.description = description;
  });
  observe();
}
observe();
updatePreview();
