const API = 'https://dummyjson.com/recipes';
const TRANSLATE = 'https://api.mymemory.translated.net/get';
const ONLINE_TIMEOUT = 6000;

const RU_EN = {
  'яйца':'egg','яйцо':'egg','молоко':'milk','помидоры':'tomato','помидор':'tomato',
  'картофель':'potato','картошка':'potato','лук':'onion','морковь':'carrot',
  'сыр':'cheese','курица':'chicken','говядина':'beef','свинина':'pork','рис':'rice',
  'масло':'olive oil','соль':'salt','сахар':'sugar','мука':'flour','хлеб':'bread',
  'капуста':'cabbage','свёкла':'beetroot','чеснок':'garlic','бекон':'bacon',
  'спагетти':'spaghetti','паста':'pasta','макароны':'pasta','авокадо':'avocado',
  'салат':'lettuce','творог':'cottage cheese','сухарики':'breadcrumbs','соус':'sauce',
  'колбаса':'sausage','грибы':'mushrooms','огурцы':'cucumber','рыба':'fish',
  'лосось':'salmon','сёмга':'salmon','тунец':'tuna','треска':'cod','минтай':'pollock',
  'лимон':'lemon','банан':'banana','шпинат':'spinach','фарш':'ground beef',
  'мёд':'honey','йогурт':'yogurt','сливки':'cream','перец':'pepper','кукуруза':'corn',
  'овсянка':'oats','вермишель':'vermicelli','зелень':'parsley','сметана':'sour cream'
};
const transCache = {};
let allMealsCache = null;

const recipes=[
 {name:"Омлет с помидорами",emoji:"🍳",time:"15 мин",cat:"Завтрак",
  ingr:["яйца","помидоры","молоко","соль"],
  steps:["Взбейте 3 яйца с 50 мл молока и щепоткой соли.","Нарежьте помидоры кубиками.",
   "Разогрейте сковороду с маслом, вылейте яйца.","Когда схватятся края — добавьте помидоры, сложите омлет пополам."]},
 {name:"Паста Карбонара",emoji:"🍝",time:"25 мин",cat:"Ужин",
  ingr:["спагетти","яйца","сыр","бекон"],
  steps:["Отварите спагетти в подсоленной воде до аль денте.","Обжарьте бекон до хрустящей корочки.",
   "Взбейте 2 желтка с тёртым сыром.","Смешайте горячую пасту с беконом, снимите с огня.",
   "Добавьте яичную смесь и быстро перемешайте — соус станет кремовым за счёт тепла."]},
 {name:"Гречка с овощами",emoji:"🥘",time:"20 мин",cat:"Обед",
  ingr:["гречка","морковь","лук","масло"],
  steps:["Промойте гречку и отварите 12–15 минут.","Натрите морковь и нарежьте лук.",
   "Обжарьте овощи на масле до мягкости.","Смешайте гречку с овощами, посолите и дайте настояться 5 минут."]},
 {name:"Сырники",emoji:"🥞",time:"30 мин",cat:"Десерт",
  ingr:["творог","яйца","мука","сахар"],
  steps:["Разотрите 200 г творога с яйцом и 2 ст. л. сахара.","Добавьте 3 ст. л. муки, замесите тесто.",
   "Сформируйте шайбочки, обваляйте в муке.","Жарьте на среднем огне по 3 минуты с каждой стороны."]},
 {name:"Салат Цезарь",emoji:"🥗",time:"15 мин",cat:"Салат",
  ingr:["курица","салат","сыр","сухарики","соус"],
  steps:["Обжарьте куриную грудку до золотистого цвета.","Порвите листья салата руками в миску.",
   "Нарежьте курицу ломтиками.","Смешайте с соусом, добавьте сухарики и тёртый сыр."]},
 {name:"Картофельное пюре",emoji:"🥔",time:"25 мин",cat:"Гарнир",
  ingr:["картофель","молоко","масло","соль"],
  steps:["Очистите и отварите картофель до мягкости (15–20 мин).","Слейте воду, добавьте тёплое молоко и масло.",
   "Разомните толкучкой до однородности.","Не используйте блендер — пюре станет клейким!"]},
 {name:"Борщ",emoji:"🍲",time:"1 ч",cat:"Обед",
  ingr:["свёкла","капуста","картофель","морковь","говядина"],
  steps:["Сварите бульон из говядины (40 мин), снимая пену.","Нарежьте картофель и добавьте в бульон.",
   "Натрите свёклу и морковь, потушите на сковороде.","Добавьте зажарку и шинкованную капусту.",
   "Варите ещё 10 минут, дайте настояться 15 минут под крышкой."]},
 {name:"Тосты с авокадо",emoji:"🥑",time:"10 мин",cat:"Завтрак",
  ingr:["хлеб","авокадо","яйца","соль"],
  steps:["Подсушите хлеб в тостере или на сковороде.","Разомните авокадо вилкой с солью.",
   "Намажьте авокадо на тосты.","Сварите яйцо пашот или глазунью и выложите сверху."]},
 {name:"Плов",emoji:"🍛",time:"50 мин",cat:"Обед",
  ingr:["рис","курица","морковь","лук","чеснок"],
  steps:["Обжарьте кусочки курицы до румяности.","Добавьте лук и морковь, жарьте 5–7 минут.",
   "Засыпьте рис, залейте горячей водой на 2 см выше риса.","Воткните зубчики чеснока, накройте крышкой.",
   "Томите на медленном огне 20 минут, не перемешивая."]},
 {name:"Блины",emoji:"🥞",time:"40 мин",cat:"Десерт",
  ingr:["мука","молоко","яйца","сахар"],
  steps:["Взбейте 2 яйца с сахаром и щепоткой соли.","Добавьте молоко и муку, размешайте до жидкого теста.",
   "Влейте ложку растительного масла — блины не будут рваться.","Жарьте на раскалённой сковороде по 1 минуте с каждой стороны."]},
 {name:"Оливье",emoji:"🥗",time:"45 мин",cat:"Салат",
  ingr:["картофель","морковь","яйца","колбаса","огурцы","сметана"],
  steps:["Отварите картофель, морковь и яйца, остудите.","Нарежьте всё кубиками одинакового размера.",
   "Нарежьте колбасу и маринованные огурцы.","Заправьте сметаной (или майонезом), посолите и перемешайте."]},
 {name:"Шакшука",emoji:"🍳",time:"25 мин",cat:"Завтрак",
  ingr:["яйца","помидоры","лук","перец"],
  steps:["Обжарьте лук и болгарский перец до мягкости.","Добавьте нарезанные помидоры, тушите 10 минут.",
   "Сделайте в соусе углубления и вбейте туда яйца.","Накройте крышкой и готовьте 5–7 минут до схватывания белка."]},
 {name:"Драники",emoji:"🥔",time:"30 мин",cat:"Ужин",
  ingr:["картофель","лук","яйца","мука"],
  steps:["Натрите картофель и лук на мелкой тёрке.","Отожмите лишнюю жидкость, добавьте яйцо и ложку муки.",
   "Посолите и перемешайте.","Жарьте небольшими лепёшками на разогретом масле по 3 минуты с каждой стороны."]},
 {name:"Куриный суп с вермишелью",emoji:"🍜",time:"40 мин",cat:"Обед",
  ingr:["курица","картофель","морковь","лук","вермишель"],
  steps:["Сварите бульон из курицы (20–25 минут).","Добавьте нарезанный картофель.",
   "Обжарьте лук с морковью и отправьте в кастрюлю.","За 5 минут до готовности всыпьте вермишель, посолите."]},
 {name:"Паста с грибами и сливками",emoji:"🍝",time:"25 мин",cat:"Ужин",
  ingr:["макароны","грибы","сливки","сыр","лук"],
  steps:["Отварите макароны до готовности.","Обжарьте лук и нарезанные грибы до золотистости.",
   "Влейте сливки, прогрейте 3–4 минуты.","Смешайте с пастой, посыпьте тёртым сыром."]},
 {name:"Жареный рис с яйцом",emoji:"🍚",time:"20 мин",cat:"Обед",
  ingr:["рис","яйца","морковь","кукуруза","соевый соус"],
  steps:["Отварите рис заранее и дайте остыть — лучше даже вчерашний.","Взбейте яйца и пожарьте тонким блинчиком, нарежьте.",
   "Обжарьте морковь и кукурузу на сильном огне.","Добавьте рис и яйца, влейте соевый соус, жарьте 3 минуты."]},
 {name:"Греческий салат",emoji:"🥗",time:"15 мин",cat:"Салат",
  ingr:["огурцы","помидоры","сыр","лук","оливки"],
  steps:["Нарежьте огурцы и помидоры крупными кусками.","Добавьте нарезанный сыр и полукольца лука.",
   "Досыпьте оливки, полейте оливковым маслом.","Посыпьте орегано и аккуратно перемешайте."]},
 {name:"Овсянка с бананом и мёдом",emoji:"🥣",time:"10 мин",cat:"Завтрак",
  ingr:["овсянка","молоко","банан","мёд"],
  steps:["Всыпьте овсянку в горячее молоко (1:2).","Варите 5 минут, помешивая.","Снимите с огня, добавьте нарезанный банан и мёд."]},
 {name:"Лосось на сковороде",emoji:"🐟",time:"15 мин",cat:"Ужин",
  ingr:["лосось","лимон","масло","перец","соль"],
  steps:["Посолите и поперчите филе лосося.","Разогрейте масло на сковороде, обжарьте рыбу по 5–6 минут с каждой стороны.",
   "Сбрызните соком лимона в конце.","Подавайте с зеленью или лёгким салатом."]},
 {name:"Треска в сливочном соусе",emoji:"🐠",time:"25 мин",cat:"Ужин",
  ingr:["треска","сливки","лук","мука","масло"],
  steps:["Нарежьте треску кусочками и слегка обваляйте в муке.","Обжарьте лук до прозрачности, добавьте рыбу.",
   "Влейте сливки и тушите под крышкой 12–15 минут.","Соус загустеет сам — не мешайте слишком часто."]},
 {name:"Сёмга в фольге в духовке",emoji:"🍣",time:"35 мин",cat:"Ужин",
  ingr:["сёмга","лимон","укроп","масло","соль"],
  steps:["Выложите филе сёмги на фольгу, посолите, сбрызните маслом и лимонным соком.",
   "Посыпьте укропом, заверните в фольгу.","Запекайте при 190°C 25–30 минут.","Перед подачей дайте постоять 3 минуты — рыба станет нежнее."]},
 {name:"Рыбные котлеты",emoji:"🍗",time:"35 мин",cat:"Ужин",
  ingr:["рыба","яйца","хлеб","лук","мука"],
  steps:["Замочите кусочек хлеба в молоке, отожмите.","Смешайте фарш из рыбы, лук, хлеб и яйцо.",
   "Сформуйте котлеты, обваляйте в муке и жарьте по 4–5 минут с каждой стороны.",
   "Можно запечь в духовке 20 минут при 180°C как альтернативу."]},
 {name:"Тунец с овощами на сковороде",emoji:"🐟",time:"15 мин",cat:"Ужин",
  ingr:["тунец","перец","лук","соевый соус","масло"],
  steps:["Нарежьте перец и лук полукольцами, обжарьте до мягкости.",
   "Добавьте кусочки тунца и жарьте ещё 5 минут — не передерживайте, тунец должен остаться сочным.",
   "Влейте соевый соус и прогрейте 1–2 минуты.","Подавайте сразу же."]},
 {name:"Минтай в томатном соусе",emoji:"🐠",time:"30 мин",cat:"Обед",
  ingr:["минтай","томаты","лук","морковь","масло"],
  steps:["Нарежьте минтай кусочками, слегка посолите.","Обжарьте лук и морковь до мягкости.",
   "Добавьте томаты (можно консервированные), тушите 5 минут.",
   "Выложите рыбу, накройте и тушите ещё 15–20 минут на слабом огне."]},
 {name:"Салат с тунцом и фасолью",emoji:"🥗",time:"10 мин",cat:"Салат",
  ingr:["тунец","фасоль","огурцы","лук","лимон"],
  steps:["Слейте жидкость с тунца и фасоли.","Нарежьте огурцы и лук, смешайте с фасолью и тунцом.",
   "Сбрызните лимонным соком, добавьте щепотку соли.","Аккуратно перемешайте и подавайте."]}
];

let myIngredients=[];

const chipsEl=document.getElementById('chips');
const input=document.getElementById('ing');
input.addEventListener('keydown',e=>{if(e.key==='Enter')addIngredient()});

function addIngredient(){
  const v=input.value.trim().toLowerCase();
  if(!v) return;
  if(!myIngredients.includes(v)){
    myIngredients.push(v);
    addToHistory(v); 
    render();
    renderHistory();
  }
  input.value='';
}
function removeIngredient(i){myIngredients.splice(i,1);render();}

let searchHistory=[];
try{ searchHistory=JSON.parse(localStorage.getItem('cookingHistory')||'[]'); }
catch(e){ searchHistory=[]; }

function saveHistory(){
  localStorage.setItem('cookingHistory',JSON.stringify(searchHistory));
}

function addToHistory(word){
  searchHistory=searchHistory.filter(w=>w!==word); 
  searchHistory.unshift(word);                     
  if(searchHistory.length>12) searchHistory=searchHistory.slice(0,12);
  saveHistory();
}

function renderHistory(){
  const tags=document.getElementById('history-tags');
  const box=document.getElementById('historyBox');
  if(!tags||!box) return;
  if(!searchHistory.length){ box.style.display='none'; return; }
  box.style.display='block';
  tags.innerHTML=searchHistory.map(w=>
    `<span class="hist-tag" onclick="addToCurrent('${w}')">${w}</span>`).join('');
}

function addToCurrent(word){
  if(!myIngredients.includes(word)){ myIngredients.push(word); render(); }
}

function render(){
  chipsEl.innerHTML=myIngredients.map((x,i)=>
    `<span class="chip" onclick="removeIngredient(${i})">${x} ✕</span>`).join('');
  const res=document.getElementById('results');
  if(!myIngredients.length){res.innerHTML='';return;}

  const scored=recipes.map(r=>{
    const have=r.ingr.filter(i=>myIngredients.some(m=>i.includes(m)||m.includes(i)));
    return{...r,have,miss:r.ingr.filter(i=>!have.includes(i)),
      pct:Math.round(have.length/r.ingr.length*100)};
  }).filter(r=>r.pct>0).sort((a,b)=>b.pct-a.pct);

  let html=scored.map(r=>`
    <div class="recipe" onclick="openRecipe(${recipes.indexOf(r)})">
      <span class="emoji">${r.emoji}</span>
      <h3>${r.name}</h3>
      <div class="meta">${r.cat} · ${r.time}</div>
      <div class="match" style="color:${r.pct>=75?'#2e7d32':r.pct>=40?'#f2a541':'#c62828'}">
        Совпадение: ${r.pct}%</div>
      <div class="ingr">✅ Есть: <span class="have">${r.have.join(', ')||'—'}</span></div>
      <div class="ingr">🛒 Докупить: <span class="miss">${r.miss.join(', ')||'—'}</span></div>
    </div>`).join('');

  html+=`<div class="online-zone" id="onlineZone"></div>`;
  res.innerHTML=html;

  searchOnline();
}

async function fetchWithTimeout(url,ms=ONLINE_TIMEOUT){
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),ms);
  try{ return await fetch(url,{signal:ctrl.signal}); }
  finally{ clearTimeout(timer); }
}

async function loadAllRecipes(){
  if(allMealsCache) return allMealsCache;
  const r=await fetchWithTimeout(`${API}?limit=50`);
  if(!r.ok) throw new Error('HTTP '+r.status);
  const d=await r.json();
  allMealsCache=d.recipes||[];
  return allMealsCache;
}

function countMatches(recipe,enList){
  const text=recipe.ingredients.map(s=>s.toLowerCase()).join(' | ');
  let matched=0;
  enList.forEach(en=>{ if(en && text.includes(en.toLowerCase())) matched++; });
  return matched;
}

async function fetchOnlineMeals(enList){
  const all=await loadAllRecipes();
  return all
    .map(r=>({...r,matched:countMatches(r,enList)}))
    .filter(r=>r.matched>0)
    .sort((a,b)=>b.matched-a.matched)
    .slice(0,8);
}

async function translateWord(ru){
  const key=ru.trim().toLowerCase();
  if(RU_EN[key]) return RU_EN[key];
  if(transCache[key]) return transCache[key];
  try{
    const r=await fetchWithTimeout(`${TRANSLATE}?q=${encodeURIComponent(key)}&langpair=ru|en`,4000);
    const d=await r.json();
    let t=(d.responseData&&d.responseData.translatedText||'').toLowerCase().trim();
    t=t.replace(/^translation\b/,'').split(',')[0].trim();
    transCache[key]=t||key;
    return transCache[key];
  }catch(e){ return key; }
}

async function searchOnline(){
  if(!myIngredients.length) return;
  const myToken=++searchToken;
  try{
    const enList=[];
    for(const ing of myIngredients) enList.push(await translateWord(ing));
    if(myToken!==searchToken) return;
    const meals=await fetchOnlineMeals(enList);
    if(myToken!==searchToken) return;
    onlineMeals=meals;
    renderOnlineResults(meals,false);
  }catch(e){
    if(myToken!==searchToken) return;
    onlineMeals=[];
    renderOnlineResults([],true);
  }
}

let searchToken=0;
let onlineMeals=[];

function renderOnlineResults(meals,failed){
  const z=document.getElementById('onlineZone'); if(!z) return;
  if(!meals.length){
    z.innerHTML=`<p class="offline-note">${
      failed?'📴 Онлайн-база рецептов недоступна — работает локальная подборка'
            :'🤷 В онлайн-базе по этим продуктам ничего не нашлось'}</p>`;
    return;
  }
  z.innerHTML=meals.map(r=>{
    const time=r.prepTimeMinutes+r.cookTimeMinutes;
    return `
    <div class="recipe" onclick="openOnlineRecipe('${r.id}')">
      <img class="recipe-img" src="${r.image}" alt="${r.name}">
      <h3>${r.name} <span class="badge-online">интернет</span></h3>
      <div class="meta">${r.cuisine} · ${r.difficulty} · ${time} мин</div>
      <div class="match" style="color:${r.matched===myIngredients.length?'#2e7d32':'#f2a541'}">
        Совпало продуктов: ${r.matched} из ${myIngredients.length}</div>
      <div class="ingr">⭐ ${r.rating} · ${r.caloriesPerServing} ккал/порция</div>
    </div>`}).join('');
}

function openRecipe(idx){
  const r=recipes[idx];
  document.getElementById('recipeModal').innerHTML=`
    <button class="close-x" onclick="closeOverlay('recipeOverlay')">✕</button>
    <div style="font-size:3rem">${r.emoji}</div>
    <h3>${r.name}</h3>
    <div class="meta" style="color:var(--muted);margin-bottom:14px">${r.cat} · ${r.time}</div>
    <div class="ingr-line">🧾 <b>Ингредиенты:</b> ${r.ingr.join(', ')}</div>
    <ol class="steps">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  openOverlay('recipeOverlay');
}

function openOnlineRecipe(id){
  const r=onlineMeals.find(m=>m.id==id); if(!r) return;
  document.getElementById('recipeModal').innerHTML=`
    <button class="close-x" onclick="closeOverlay('recipeOverlay')">✕</button>
    <img class="modal-img" src="${r.image}" alt="${r.name}">
    <h3>${r.name}</h3>
    <div class="meta" style="color:var(--muted);margin-bottom:14px">
      ${r.cuisine} · ${r.difficulty} · ${r.prepTimeMinutes+r.cookTimeMinutes} мин ·
      ${r.servings} порции · ⭐ ${r.rating} · рецепт из интернета</div>
    <div class="ingr-line">🧾 <b>Ингредиенты:</b> ${r.ingredients.join(', ')}</div>
    <ol class="steps">${r.instructions.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  openOverlay('recipeOverlay');
}

const noteArea=document.getElementById('noteArea');
noteArea.value=localStorage.getItem('cookingNotes')||'';

function openNotes(){openOverlay('notesOverlay');noteArea.focus();}
function saveNotes(showStatus){
  localStorage.setItem('cookingNotes',noteArea.value);
  if(showStatus){
    const s=document.getElementById('noteStatus');
    s.style.opacity=1;setTimeout(()=>s.style.opacity=0,1500);
  }
}
function clearNotes(){
  if(confirm('Очистить заметку?')){noteArea.value='';saveNotes(false);}
}
noteArea.addEventListener('input',()=>saveNotes(false));

function openOverlay(id){document.getElementById(id).classList.add('open');}
function closeOverlay(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeOverlay('notesOverlay');closeOverlay('recipeOverlay');}
});

const dishes=[
 {n:'Паста',e:'🍝',g:'linear-gradient(135deg,#e85d3d,#f2a541)'},
 {n:'Салат',e:'🥗',g:'linear-gradient(135deg,#43a047,#8bc34a)'},
 {n:'Пицца',e:'🍕',g:'linear-gradient(135deg,#d84315,#ffb300)'},
 {n:'Суп',e:'🍲',g:'linear-gradient(135deg,#e64a19,#ff8a65)'},
 {n:'Блины',e:'🥞',g:'linear-gradient(135deg,#f2a541,#ffd54f)'},
 {n:'Роллы',e:'🍣',g:'linear-gradient(135deg,#e53935,#ff8a80)'},
 {n:'Кофе',e:'☕',g:'linear-gradient(135deg,#6d4c41,#a1887f)'},
 {n:'Торт',e:'🍰',g:'linear-gradient(135deg,#ec407a,#f48fb1)'},
];
const track=document.getElementById('track');
track.innerHTML=[...dishes,...dishes]
  .map(d=>`<div class="dish" style="background:${d.g}"><span class="em">${d.e}</span>${d.n}</div>`).join('');

new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')});
},{threshold:.15}).observe(document.getElementById('banner'));

renderHistory(); 

let currentUser = localStorage.getItem('cookingUser') || null;

function getUsers(){
  try{ return JSON.parse(localStorage.getItem('cookingUsers')||'{}'); }
  catch(e){ return {}; }
}
function saveUsers(u){ localStorage.setItem('cookingUsers', JSON.stringify(u)); }

function switchAuthTab(tab){
  const isLogin = tab==='login';
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabReg').classList.toggle('active', !isLogin);
  document.getElementById('authTitle').textContent = isLogin?'Вход':'Регистрация';
  document.getElementById('pass2Field').style.display = isLogin?'none':'block';
  document.getElementById('authSubmit').textContent = isLogin?'Войти':'Создать аккаунт';
  document.getElementById('authMsg').textContent='';
}

function openAuth(){ openOverlay('authOverlay'); switchAuthTab('login'); }

function submitAuth(){
  const login = document.getElementById('authLogin').value.trim();
  const pass  = document.getElementById('authPass').value;
  const msg   = document.getElementById('authMsg');
  msg.classList.remove('ok');

  if(login.length<3){ msg.textContent='Логин — минимум 3 символа'; return; }
  if(pass.length<4){ msg.textContent='Пароль — минимум 4 символа'; return; }

  const users = getUsers();
  const isLoginMode = document.getElementById('tabLogin').classList.contains('active');

  if(isLoginMode){
    if(!users[login]){ msg.textContent='Такого пользователя нет — зарегистрируйтесь'; return; }
    if(users[login]!==pass){ msg.textContent='Неверный пароль'; return; }
    currentUser = login;
    msg.classList.add('ok'); msg.textContent='Добро пожаловать, '+login+'!';
    setTimeout(finishAuth, 600);
  } else {
    const pass2 = document.getElementById('authPass2').value;
    if(pass!==pass2){ msg.textContent='Пароли не совпадают'; return; }
    if(users[login]){ msg.textContent='Этот логин уже занят'; return; }
    users[login] = pass;          
    saveUsers(users);
    currentUser = login;
    msg.classList.add('ok'); msg.textContent='Аккаунт создан!';
    setTimeout(finishAuth, 600);
  }
}

function finishAuth(){
  localStorage.setItem('cookingUser', currentUser);
  closeOverlay('authOverlay');
  renderAuthButton();
  document.getElementById('authPass').value='';
  document.getElementById('authPass2').value='';
}

function renderAuthButton(){
  const btn = document.getElementById('authBtn');
  if(currentUser){
    btn.innerHTML = `<span class="user-menu"><span>👤 ${currentUser}</span>
      <button class="logout-btn" onclick="event.stopPropagation();logout()">Выйти</button></span>`;
  } else {
    btn.textContent = 'Войти';
  }
}

function logout(){
  currentUser = null;
  localStorage.removeItem('cookingUser');
  renderAuthButton();
}

['authLogin','authPass','authPass2'].forEach(id=>{
  document.getElementById(id).addEventListener('keydown',e=>{
    if(e.key==='Enter') submitAuth();
  });
});

renderAuthButton(); // восстановить состояние при загрузке страницы
