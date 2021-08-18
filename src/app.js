import info from './info'; // Информация для карточек

const d = document; // экономия 7 байт веса файла

const data = localStorage['data'] ? JSON.parse(localStorage['data']) : info;

function renderBlock(i) {
    const tp = [ 'Todo', 'In progress', 'Done' ];
    d.body.innerHTML +=  `
        <div class="block">
            <div class="header">${tp[i]}</div>
            <ul>
                ${
                    data[tp[i]].map(el => {
                        if (el.text !== '' || el.img !== '') { // Если есть какая-то информация
                            return `
                                <li>
                                    ${el.text !== '' ? `<div class="text">${el.text}</div>` : ''}
                                    ${el.img !== '' ? `<img src="${el.img}" alt="image" />` : ''}
                                </li>
                            `;
                        }
                    }).join(' ')
                }
            </ul>
            <div class="add"><span>&#43;</span> Add another card</div>
        </div>
    `;
}

// Рендерит 3 блока
for (let db = 0; db < 3; db++) renderBlock(db);

d.getElementsByTagName('li').forEach(el => {
    el.addEventListener('mousedown', e => {
        e.preventDefault();
        const target = e.target.tagName !== 'LI' ? e.target.parentNode : e.target;
        const parent = target.parentNode;
        const coords = getCoords(target);
        const shiftX = e.pageX - coords.left;
        const shiftY = e.pageY - coords.top;

        target.classList.add('grabbed');
        document.body.appendChild(target);
        move(e);

        function move(e) {
            target.style.left = `${e.pageX - shiftX}px`;
            target.style.top = `${e.pageY - shiftY}px`;
        }

        document.addEventListener('mousemove', move);

        function insert(tar, ev) {
            tar.children[1].insertAdjacentElement('beforeend', ev.target);
        }

        target.onmouseup =  ev => {
            const drop = document.elementsFromPoint(ev.clientX, ev.clientY)[1];

            if (drop.tagName === 'DIV' && drop.classList.contains('block')) insert(drop, ev);
            else if (drop.tagName === 'DIV' && drop.classList.contains('text') || drop.tagName === 'IMG')
                insert(drop.offsetParent.offsetParent, ev)
            else if (drop.tagName === 'UL') insert(drop.offsetParent, ev)
            else if (drop.tagName === 'LI') insert(drop.offsetParent, ev)
            else parent.insertAdjacentElement('beforeend', ev.target);

            ev.target.style.top = '';
            ev.target.style.left = '';
            ev.target.classList.remove('grabbed');
            document.removeEventListener('mousemove', move);
            target.onmouseup = null;
        };

        target.addEventListener('dragstart', () => { return false; });

        function getCoords(elem) {
            const box = elem.getBoundingClientRect();
            return { top: box.top + pageYOffset, left: box.left + pageXOffset };
        }
    });
});