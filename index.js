const header = document.querySelector('h1');
const resultTable = document.querySelector('.results__table');
const copiedAlert = document.getElementById('copy');

const inputBtn = document.getElementById('button-translit');
const inputTxt = document.getElementById('input-translit');

const tableRu = document.getElementById('ru');
const tableTr = document.getElementById('tr');

const clearAllBtn = document.getElementById('clear-all__btn');

const dictionary = new Map([
  ['А', 'A'],
  ['а', 'a'],
  ['Б', 'B'],
  ['б', 'b'],
  ['В', 'V'],
  ['в', 'v'],
  ['Г', 'G'],
  ['г', 'g'],
  ['Д', 'D'],
  ['д', 'd'],
  ['Е', 'Ye'],
  ['е', 'ye'],
  ['Ё', 'Yo'],
  ['ё', 'yo'],
  ['Ж', 'Zh'],
  ['ж', 'zh'],
  ['З', 'Z'],
  ['з', 'z'],
  ['И', 'I'],
  ['и', 'i'],
  ['Й', 'Y'],
  ['й', 'y'],
  ['К', 'K'],
  ['к', 'k'],
  ['Л', 'L'],
  ['л', 'l'],
  ['М', 'M'],
  ['м', 'm'],
  ['Н', 'N'],
  ['н', 'n'],
  ['О', 'O'],
  ['о', 'o'],
  ['П', 'P'],
  ['п', 'p'],
  ['Р', 'R'],
  ['р', 'r'],
  ['С', 'S'],
  ['с', 's'],
  ['Т', 'T'],
  ['т', 't'],
  ['У', 'U'],
  ['у', 'u'],
  ['Ф', 'F'],
  ['ф', 'f'],
  ['Х', 'Kh'],
  ['х', 'kh'],
  ['Ц', 'Ts'],
  ['ц', 'ts'],
  ['Ч', 'Ch'],
  ['ч', 'ch'],
  ['Ш', 'Sh'],
  ['ш', 'sh'],
  ['Щ', 'Shch'],
  ['щ', 'shch'],
  ['Ъ', '"'],
  ['ы', 'y'],
  ['Ы', 'Y'],
  ['ь', "'"],
  ['Ь', "'"],
  ['э', 'e'],
  ['Э', 'E'],
  ['ю', 'yu'],
  ['Ю', 'Yu'],
  ['я', 'ya'],
  ['Я', 'Ya'],
]);
const consonants = [
  'Б',
  'В',
  'Г',
  'Д',
  'Ж',
  'З',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'П',
  'Р',
  'С',
  'Т',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'б',
  'в',
  'г',
  'д',
  'ж',
  'з',
  'й',
  'к',
  'л',
  'м',
  'н',
  'п',
  'р',
  'с',
  'т',
  'ф',
  'х',
  'ц',
  'ч',
  'ш',
  'щ',
];
const doubleVowels = ['Е', 'Ё', 'е', 'ё'];
const dictionaryClosedVowels = new Map([
  ['Е', 'E'],
  ['Ё', 'O'],
  ['е', 'e'],
  ['ё', 'o'],
]);

function translit(str) {
  if (str.length === 0) return str;

  let result = '';

  result += dictionary.has(str[0]) ? dictionary.get(str[0]) : str[0];

  for (let i = 1; i < str.length; i++) {
    if (!dictionary.has(str[i])) {
      result += str[i];
      continue;
    }

    result +=
      doubleVowels.includes(str[i]) && consonants.includes(str[i - 1])
        ? dictionaryClosedVowels.get(str[i])
        : dictionary.get(str[i]);
  }

  return result;
}

function copyWithAlert(element) {
  let textForCopy;

  if ('fullWord' in element.firstElementChild.dataset) {
    textForCopy = element.firstElementChild.dataset.fullWord;
  } else {
    textForCopy = element.firstElementChild.innerText;
  }

  navigator.clipboard.writeText(textForCopy);

  copiedAlert.classList.add('copied');
  setTimeout(() => {
    copiedAlert.classList.remove('copied');
  }, 1500);
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

function appendResult(ru) {
  const tr = translit(ru);
  const { result: normaliseInput, trimmed } = normalise(ru);
  const { result: normaliseTranslit } = normalise(tr);

  const dataRu = document.createElement('li');
  dataRu.addEventListener('click', (event) => {
    copyWithAlert(
      event.target.nodeName === 'li' ? event.target : event.target.closest('li')
    );
  });
  dataRu.title = 'Нажмите, чтобы скопировать содержимое!';
  const textRu = document.createElement('div');
  textRu.innerText = normaliseInput;
  if (trimmed) {
    textRu.dataset.fullWord = ru;
  }
  dataRu.append(textRu);

  const dataTr = document.createElement('li');
  dataTr.addEventListener('click', (event) => {
    copyWithAlert(
      event.target.nodeName === 'li' ? event.target : event.target.closest('li')
    );
  });
  dataTr.title = 'Нажмите, чтобы скопировать содержимое!';
  const textTr = document.createElement('div');
  textTr.innerText = normaliseTranslit;
  if (trimmed) {
    textTr.dataset.fullWord = tr;
  }
  dataTr.append(textTr);

  const deleteIco = document.createElement('div');
  deleteIco.className = 'delete-icon';
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.append(deleteIco);
  const eventarise = (element) => {
    element.addEventListener('click', (event) => {
      const triggeredLi = event.target.closest('li');
      const position = Array.from(triggeredLi.closest('ol').children).findIndex(
        (x) => x === triggeredLi
      );

      tableRu.children[position].remove();
      tableTr.children[position].remove();
    });
    element.addEventListener('mouseenter', (event) => {
      const triggeredLi = event.target.closest('li');
      const position = Array.from(triggeredLi.closest('ol').children).findIndex(
        (x) => x === triggeredLi
      );

      tableRu.children[position].classList.toggle('will-delete');
      tableTr.children[position].classList.toggle('will-delete');
    });
    element.addEventListener('mouseleave', (event) => {
      const triggeredLi = event.target.closest('li');
      const position = Array.from(triggeredLi.closest('ol').children).findIndex(
        (x) => x === triggeredLi
      );

      tableRu.children[position].classList.toggle('will-delete');
      tableTr.children[position].classList.toggle('will-delete');
    });

    return element;
  };

  dataRu.append(eventarise(deleteBtn));
  dataTr.append(eventarise(deleteBtn.cloneNode(true)));

  tableRu.append(dataRu);
  tableTr.append(dataTr);
}

function unfocus() {
  const temp = document.createElement('input');
  document.body.appendChild(temp);
  temp.focus();
  document.body.removeChild(temp);
}

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
  const nodesFordelete = [...tableRu.children, ...tableTr.children];

  for (const entry of nodesFordelete) {
    if (entry.className === 'example') continue;

    entry.remove();
  }
});
clearAllBtn.addEventListener('mouseenter', () => {
  const nodesFordelete = [...tableRu.children, ...tableTr.children];

  for (const entry of nodesFordelete) {
    if (entry.className === 'example') continue;

    entry.classList.toggle('will-delete');
  }
});
clearAllBtn.addEventListener('mouseleave', () => {
  const nodesFordelete = [...tableRu.children, ...tableTr.children];

  for (const entry of nodesFordelete) {
    if (entry.className === 'example') continue;

    entry.classList.toggle('will-delete');
  }
});
header.addEventListener('click', () => {
  if (window.innerWidth > 600) return;

  header.classList.toggle('rainbow');
  resultTable.classList.toggle('horizontal-mode');
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 600) {
    header.classList.remove('rainbow');
    resultTable.classList.remove('horizontal-mode');
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key.match(/[А-Яа-я]|\w|\s/) && event.key.length === 1)
    inputTxt.focus();

  if (event.key === 'Escape') unfocus();
});
document.querySelectorAll('.example').forEach((x) => {
  x.addEventListener('click', (event) => {
    copyWithAlert(
      event.target.nodeName === 'li' ? event.target : event.target.closest('li')
    );
  });
});
