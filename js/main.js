// Находим элементы на странице
const form = document.querySelector('#form');
const taskName = document.querySelector('#taskInputName');
const taskDescription = document.querySelector('#taskInputDesc');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

const editName = document.querySelector('#taskEditName');
const editDesc = document.querySelector('#taskEditDesc');
const editForm = document.querySelector('#editForm');

let currEl = {};
let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
editForm.addEventListener('submit', editTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', activeEdit);

// Функции
function addTask(event) {
	// Відміняєм дефолтну поведінку
	event.preventDefault();

	// Отримуємо текст задачі із полів вводу
	const taskText = taskName.value;
	const taskDesc = taskDescription.value;

	// Описуємо задачу у вигляді об'єкту
	const newTask = {
		id: Date.now(),
		name: taskText,
		description: taskDesc,
		done: false,
	};

	// Додаємо задачу у масив задач
	tasks.push(newTask);

	// Додаємо список завдань у localStorage
	saveToLocalStorage();


	// Рендерим завдання на сторінці
	renderTask(newTask);

	// Очищуєм поле вводу і повертаємо на нього фокус
	taskName.value = '';
	taskDescription.value = '';
	taskName.focus();
	taskDescription.focus();

	checkEmptyList();
}

function deleteTask(event) {
	// Проверяем если клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Определяем ID задачи
	const id = Number(parenNode.id);

	// Удаляем задча через фильтрацию массива
	tasks = tasks.filter((task) => task.id !== id);

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	// Удаляем задачу из разметки
	parenNode.remove();

	checkEmptyList();
}

function editTask(event) {
	// Відміняєм дефолтну поведінку
	event.preventDefault();

	// Редагуємо об'єкт задачі (вносимо у об'єкт значення які були введені у інпути для редагування завдання)
	let newTask = {
		id: currEl.id,
		name: editName.value,
		description: editDesc.value,
		done: currEl.done,
	}
	
	
	document.getElementById(`${currEl.id}`).remove()

	// Отримуємо індекс поточного елемента
	let index = tasks.map(function(e) { return e.id; }).indexOf(currEl.id);

	// Перезаписуємо обект завдання за поточним індексом
	tasks[index] = newTask;

	// Зберігаємо оновлений об'єкт у localStorage
	saveToLocalStorage();
	// Відмальовуємо таску зі змінами
	renderTask(newTask);
    // Ховаємо форму для редагування            
	editForm.classList.add('none')

}

function activeEdit (event){
	// Перевіряєм що клік було виконано НЕ по кнопці "редагувати завдання"
	if (event.target.dataset.action !== 'edit') return;
	
	// Якщо форма для редагування скрита показуємо її якщо ні, скриваємо
	editForm.classList.contains('none') ? editForm.classList.remove('none') : editForm.classList.add('none')
	

	const parenNode = event.target.closest('.list-group-item');

	// Отримуємо елемент по якому було зроблено клік кнопки edit і який будемо змінювати
	const id = Number(parenNode.id);
	const task = tasks.find((task) => task.id === id);
	currEl = task
	
}




function doneTask(event) {
	// Перевіряєм що клік було виконано НЕ по кнопці "завдання виконано"
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');


	// Визначаємо ID завдання
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;


	// Зберігаємо список завдань у localStorage
	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/logo.png" alt="Empty" width="120" class="mt-3">
					<div class="empty-list__title">Todo list is empty</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формуємо CSS клас
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';


	// Формуємо розмітку для нової
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">Task name: ${task.name}</span>
					<span class="${cssClass}">Task description: ${task.description}</span>
					<span class="${cssClass}">Task date: ${new Date().toLocaleDateString()} Task time: ${new Date().toLocaleTimeString()}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="edit" class="btn-action">
							<img src="./img/pencil-square.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Додаємо завдання на сторінку
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

