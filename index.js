const inputBtn = document.getElementById('button-translit');
const inputTxt = document.getElementById('input-translit');

const tableRu = document.getElementById('ru');
const tableTr = document.getElementById('tr');

const clearAllBtn = document.getElementById('clear-all__btn');

inputBtn.addEventListener('click', () => {
  if (inputTxt.value === '') return;
  appendResult(inputTxt.value);
  inputTxt.value = '';
  inputTxt.focus();
});
inputTxt.addEventListener('keypress', (event) => {
  if (event.key !== 'Enter' || inputTxt.value === '') return;
  appendResult(inputTxt.value);
  inputTxt.value = '';
  inputTxt.focus();
});
clearAllBtn.addEventListener('click', () => {
  for (let entry of [...tableRu.children, ...tableTr.children]) {
    if (entry.className === 'example') continue;

    entry.remove();
  }
});

function appendResult(ru) {
  let tr = translit(ru);
  let { result: normaliseInput, trimmed } = normalise(ru);
  let { result: normaliseTranslit } = normalise(tr);

  let dataRu = document.createElement('li');
  let textRu = document.createElement('div');
  textRu.innerText = normaliseInput;
  if (trimmed) {
    textRu.dataset.fullWord = ru;
  }
  dataRu.append(textRu)

  let dataTr = document.createElement('li');
  let textTr = document.createElement('div');
  textTr.innerText = normaliseTranslit;
  if (trimmed) {
    textTr.dataset.fullWord = tr;
  }
  dataTr.append(textTr);

  let deleteIco = document.createElement('div');
  deleteIco.className = 'delete-icon';
  let deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.append(deleteIco);
  deleteBtn.addEventListener('click', (event) => {
    let triggeredLi = event.target.closest('li');
    let position = Array.from(triggeredLi.closest('ol').children).findIndex(x => x === triggeredLi);
    console.log(position)

    tableRu.children[position].remove();
    tableTr.children[position].remove();
  })

  dataRu.append(deleteBtn);
  dataTr.append(deleteBtn);

  tableRu.append(dataRu);
  tableTr.append(dataTr);
}

function normalise(str) {
  let result = str;
  let trimmed = false;

  if (str.length > 7) {
    result = str.slice(0, 7).padEnd(8, '…');
    trimmed = true;
  }

  return { result, trimmed };
}

const dictionary = new Map([
  ['А', 'A'],     ['а', 'a'],
  ['Б', 'B'],     ['б', 'b'],
  ['В', 'V'],     ['в', 'v'],
  ['Г', 'G'],     ['г', 'g'],
  ['Д', 'D'],     ['д', 'd'],
  ['Е', 'Ye'],    ['е', 'ye'],
  ['Ё', 'Yo'],     ['ё', 'yo'],
  ['Ж', 'Zh'],    ['ж', 'zh'],
  ['З', 'Z'],     ['з', 'z'],
  ['И', 'I'],     ['и', 'i'],
  ['Й', 'Y'],     ['й', 'y'],
  ['К', 'K'],     ['к', 'k'],
  ['Л', 'L'],     ['л', 'l'],
  ['М', 'M'],     ['м', 'm'],
  ['Н', 'N'],     ['н', 'n'],
  ['О', 'O'],     ['о', 'o'],
  ['П', 'P'],     ['п', 'p'],
  ['Р', 'R'],     ['р', 'r'],
  ['С', 'S'],     ['с', 's'],
  ['Т', 'T'],     ['т', 't'],
  ['У', 'U'],     ['у', 'u'],
  ['Ф', 'F'],     ['ф', 'f'],
  ['Х', 'Kh'],    ['х', 'kh'],
  ['Ц', 'Ts'],    ['ц', 'ts'],
  ['Ч', 'Ch'],    ['ч', 'ch'],
  ['Ш', 'Sh'],    ['ш', 'sh'],
  ['Щ', 'Shch'],  ['щ', 'shch'],
  ['Ъ', '"'],     ['ы', 'y'],
  ['Ы', 'Y'],     ['ь', '\''],
  ['Ь', '\''],    ['э', 'e'],     
  ['Э', 'E'],     ['ю', 'yu'],    
  ['Ю', 'Yu'],    ['я', 'ya'],    
  ['Я', 'Ya']    
  ]);
  const consonants = [ 'Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ' ];
  const doubleVowels = [ 'Е', 'Ё', 'е', 'ё' ];
  const dictionaryClosedVowels = new Map([
    ['Е', 'E'],
    ['Ё', 'O'],
    ['е', 'e'],
    ['ё', 'o']
  ]);

function translit(str) {
  if (str.length === 0) return str;

  let result = '';

  result += dictionary.has(str[0]) ? dictionary.get(str[0]) : str[0];

  for(let i = 1; i < str.length; i++) {
    if (!dictionary.has(str[i])) {
      result += str[i];
      continue;
    }

    result += (doubleVowels.includes(str[i]) 
              && consonants.includes(str[i - 1])) 
                ? dictionaryClosedVowels.get(str[i])
                : dictionary.get(str[i]);
  }

  return result;
}
