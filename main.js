const prepareBoard = (boardLength) => {
	const cells = document.querySelectorAll('#board .cell');
	const rowsOfCells = [];
	const columnsOfCells = [];
	const rowsOfCellsReversed = [];
	const columnsOfCellsReversed = [];

	for (let i = 0; i < boardLength; i++) {
		rowsOfCells.push([]);
		columnsOfCells.push([]);
		rowsOfCellsReversed.push([]);
		columnsOfCellsReversed.push([]);
	}

	let loopCounter = 0;
	let rowCounter = 0;

	cells.forEach((cell) => {
		loopCounter++;
		if (loopCounter < boardLength) {
			rowsOfCells[rowCounter].push(cell);
		} else {
			rowsOfCells[rowCounter].push(cell);
			loopCounter = 0;
			rowCounter++;
		}
	});

	loopCounter = 0;
	rowCounter = 0;

	cells.forEach((cell) => {
		loopCounter++;
		if (loopCounter < boardLength) {
			columnsOfCells[loopCounter - 1].push(cell);
		} else {
			columnsOfCells[loopCounter - 1].push(cell);
			loopCounter = 0;
		}
	});

	loopCounter = 0;
	rowCounter = 0;

	cells.forEach((cell) => {
		loopCounter++;
		if (loopCounter < boardLength) {
			rowsOfCellsReversed[rowCounter].push(cell);
		} else {
			rowsOfCellsReversed[rowCounter].push(cell);
			loopCounter = 0;
			rowCounter++;
		}
	});

	rowsOfCellsReversed.forEach((row) => row.reverse());

	loopCounter = 0;
	rowCounter = 0;

	cells.forEach((cell) => {
		loopCounter++;
		if (loopCounter < boardLength) {
			columnsOfCellsReversed[loopCounter - 1].push(cell);
		} else {
			columnsOfCellsReversed[loopCounter - 1].push(cell);
			loopCounter = 0;
		}
	});

	columnsOfCellsReversed.forEach((row) => row.reverse());

	return {
		rowsOfCells: rowsOfCells,
		columnsOfCells: columnsOfCells,
		rowsOfCellsReversed: rowsOfCellsReversed,
		columnsOfCellsReversed: columnsOfCellsReversed,
	};
};

const preparedBoard = prepareBoard(4);

const addCellValueOf2 = () => {
	const cellsElements = document.querySelectorAll('.cell');
	const emptyCells = [];

	cellsElements.forEach((cell) => {
		const cellValueElement = cell.querySelector('#value');
		if (cellValueElement.innerHTML === '') {
			emptyCells.push(cell);
		}
	});

	const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
	const randomCellValue = (randomCell.querySelector('#value').innerHTML =
		Math.floor(Math.random() * 10) + 1 < 8 ? '2' : '4');
	randomCell.querySelector('.inside-cell').style.transition = 'background-color 0ms, transform 0ms, opacity 0ms';
	randomCell.querySelector('.inside-cell').style.opacity = '0';
	randomCell.querySelector('.inside-cell').style.transform = 'scale(0)';
	randomCell.querySelector('.inside-cell').classList.add(`inside-cell-${randomCellValue}`);

	setTimeout(() => {
		randomCell.querySelector('.inside-cell').style.transition =
			'background-color 0ms, transform 250ms, opacity 250ms';
		randomCell.querySelector('.inside-cell').style.opacity = '1';
		randomCell.querySelector('.inside-cell').style.transform = 'scale(1)';
	}, 25);
};

addCellValueOf2();
addCellValueOf2();

const updateScore = (sumOfCells = null) => {
	const scoreElement = document.querySelector('#header h1');
	const header = document.querySelector('#header');
	const createdParagraphTag = document.createElement('p');
	scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + sumOfCells;
	createdParagraphTag.style.left = `${Math.floor(Math.random() * 80) + 10}%`;
	createdParagraphTag.innerHTML = `+${sumOfCells}`;
	header.appendChild(createdParagraphTag);
	createdParagraphTag.addEventListener('animationend', () => createdParagraphTag.remove());
	return parseInt(scoreElement.innerHTML);
};

let isKeyPressed = false;
let isCheated = false;
let isAnimationEnd = true;

const gameOver = () => {
	const gameOverElement = document.querySelector('#game-over');
	const startAgainButton = document.querySelector('#game-over button');
	const scoreElementInGameOver = document.querySelector('#game-over h1');
	const scoreElement = document.querySelector('#header h1');
	const cells = document.querySelectorAll('#board .cell');
	const bestScore = document.querySelector('#header #best-score');
	const localStorageBestScore = localStorage.getItem('bestScore') === null ? 0 : localStorage.getItem('bestScore');
	scoreElementInGameOver.style.whiteSpace = 'nowrap';
	bestScore.innerHTML = `Best: ${localStorageBestScore}`;

	scoreElementInGameOver.innerHTML = `${scoreElement.innerHTML} pts!`;

	if (isCheated) {
		scoreElementInGameOver.innerHTML = `That's sad what have you done...`;
		scoreElementInGameOver.style.whiteSpace = 'unset';
		if (startAgainButton) {
			startAgainButton.remove();
		}
	}

	if (isAnimationEnd) {
		setTimeout(() => {
			cells.forEach((cell, index, array) => {
				const cellInsideCell = cell.querySelector('.inside-cell');
				cellInsideCell.style.transition = 'transform 250ms, opacity 250ms, background-color 250ms';
				setTimeout(() => {
					const myAnimation = cell.animate(
						[
							{
								transform: 'translateY(0px) rotate(0deg)',
								opacity: '1',
							},
							{
								transform: 'translateY(50px) rotate(10deg)',
								opacity: '0',
							},
						],
						{
							duration: 500,
							fill: 'forwards',
							easing: 'ease-in-out',
						}
					);

					startAgainButton.addEventListener(
						'click',
						() => {
							myAnimation.cancel();
						},
						{ once: true }
					);

					if (index === array.length - 1) {
						isAnimationEnd = true;
					}
				}, 50 * index);
			});

			setTimeout(() => {
				gameOverElement.style.opacity = '1';
				gameOverElement.style.pointerEvents = 'all';
			}, 1500);
		}, 750);
	}
	isAnimationEnd = false;

	if (startAgainButton) {
		startAgainButton.addEventListener(
			'click',
			() => {
				localStorage.setItem('bestScore', scoreElement.innerHTML);
				bestScore.innerHTML = `Best: ${scoreElement.innerHTML}`;
				gameOverElement.style.opacity = '0';
				gameOverElement.style.pointerEvents = 'none';
				setTimeout(() => {
					scoreElement.innerHTML = '0';
				}, 10);
				isKeyPressed = true;

				cells.forEach((cell) => {
					const cellValue = cell.querySelector('#value');
					cellValue.innerHTML = '';
					cell.querySelector('.inside-cell').className = 'inside-cell';
				});

				setTimeout(() => {
					isKeyPressed = false;
				}, 100);

				addCellValueOf2();
				addCellValueOf2();
			},
			{ once: true }
		);
	}
};

let myTimeout;

const initMove = (move) => {
	const { rowsOfCells, columnsOfCells, rowsOfCellsReversed, columnsOfCellsReversed } = preparedBoard;
	let currentRowsOrColums = undefined;
	let isReadyToGenerteNewCell = false;

	if (move === 'right') {
		currentRowsOrColums = rowsOfCellsReversed;
	}
	if (move === 'left') {
		currentRowsOrColums = rowsOfCells;
	}
	if (move === 'up') {
		currentRowsOrColums = columnsOfCells;
	}
	if (move === 'down') {
		currentRowsOrColums = columnsOfCellsReversed;
	}

	currentRowsOrColums.forEach((row) => {
		row.forEach((cell, index, array) => {
			const cellValue = cell.querySelector('#value');
			const cellInsideCell = cell.querySelector('.inside-cell');
			const marginOfCell = parseInt(window.getComputedStyle(cell).getPropertyValue('margin'));
			cellInsideCell.style.transition = 'transform 250ms, opacity 250ms, background-color 125ms';

			if (cellValue.innerHTML !== '') {
				let isFoundCell = false;
				let isEveryCellEmpty = true;

				array.forEach((cell1, index1, array1) => {
					const cell1Value = cell1.querySelector('#value');
					const cell1InsideCell = cell1.querySelector('.inside-cell');

					if (index1 > index) {
						const previousCell1Value = array1[index1 - 1].querySelector('#value');

						if (cell1Value.innerHTML === '' && isEveryCellEmpty === true) {
							isEveryCellEmpty = true;
						} else if (cell1Value.innerHTML !== cellValue.innerHTML) {
							isEveryCellEmpty = false;
						}

						if (
							isFoundCell === false &&
							cell1Value.innerHTML === cellValue.innerHTML &&
							isEveryCellEmpty === true
						) {
							const { top: top1, left: left1, width, height } = cell1.getBoundingClientRect();
							const { top, left } = cell.getBoundingClientRect();
							const { top: topBorad, left: leftBoard } = document
								.querySelector('#board')
								.getBoundingClientRect();
							const fakeCell = document.createElement('div');
							isFoundCell = true;
							isReadyToGenerteNewCell = true;

							fakeCell.classList = 'cell';
							fakeCell.innerHTML = cell1.innerHTML;
							fakeCell.style.position = 'fixed';
							fakeCell.style.pointerEvents = 'none';
							fakeCell.style.top = `${top1 - topBorad - marginOfCell}px`; //5 means margin of element
							fakeCell.style.left = `${left1 - leftBoard - marginOfCell}px`;
							fakeCell.style.width = `${width}px`;
							fakeCell.style.height = `${height}px`;

							fakeCell
								.animate(
									[
										{
											top: `${top1 - topBorad - marginOfCell}px`,
											left: `${left1 - leftBoard - marginOfCell}px`,
											opacity: '1',
										},
										{
											top: `${top - topBorad - marginOfCell}px`,
											left: `${left - leftBoard - marginOfCell}px`,
											opacity: '0',
										},
									],
									{
										duration: 250,
										fill: 'forwards',
										easing: 'ease-in-out',
									}
								)
								.addEventListener('finish', () => fakeCell.remove());

							document.querySelector('#board').appendChild(fakeCell);

							cellValue.innerHTML = parseInt(cellValue.innerHTML) + parseInt(cell1Value.innerHTML);

							cellInsideCell.className = 'inside-cell';
							cellInsideCell.classList.add(`inside-cell-${cellValue.innerHTML}`);

							cell1InsideCell.className = 'inside-cell';
							cell1Value.innerHTML = '';

							updateScore(parseInt(cellValue.innerHTML));
						}
					}
				});
			}
		});

		row.forEach((cell, index, array) => {
			const cellValue = cell.querySelector('#value');
			const cellInsideCell = cell.querySelector('.inside-cell');
			const marginOfCell = parseInt(window.getComputedStyle(cell).getPropertyValue('margin'));

			if (cellValue.innerHTML === '') {
				let isFoundCell = false;
				array.forEach((cell1, index1, array1) => {
					const cell1Value = cell1.querySelector('#value');
					const cell1InsideCell = cell1.querySelector('.inside-cell');

					if (index1 > index) {
						if (isFoundCell === false && cell1Value.innerHTML !== '') {
							const { width } = cellInsideCell.getBoundingClientRect();
							isFoundCell = true;
							isReadyToGenerteNewCell = true;

							cellValue.innerHTML = cell1Value.innerHTML;

							cellInsideCell.className = 'inside-cell';
							cellInsideCell.classList.add(`inside-cell-${cellValue.innerHTML}`);
							cell1InsideCell.className = 'inside-cell';

							cellInsideCell.style.transition = 'all 0ms';
							cell1Value.innerHTML = '';

							if (move === 'right') {
								//10 means margin of element
								cellInsideCell.style.transform = `translate(${
									(-width + -marginOfCell * 2) * (index1 - index)
								}px ,0px)`;

								setTimeout(() => {
									cellInsideCell.style.transition =
										'transform 250ms, opacity 250ms, background-color 125ms';
									cellInsideCell.style.transform = `translate(0px ,0px)`;
								}, 1);
							}

							if (move === 'left') {
								cellInsideCell.style.transform = `translate(${
									(width + marginOfCell * 2) * (index1 - index)
								}px ,0px)`;

								setTimeout(() => {
									cellInsideCell.style.transition =
										'transform 250ms, opacity 250ms, background-color 125ms';
									cellInsideCell.style.transform = `translate(0px ,0px)`;
								}, 1);
							}

							if (move === 'up') {
								cellInsideCell.style.transform = `translate(0px ,${
									(width + marginOfCell * 2) * (index1 - index)
								}px)`;

								setTimeout(() => {
									cellInsideCell.style.transition =
										'transform 250ms, opacity 250ms, background-color 125ms';
									cellInsideCell.style.transform = `translate(0px ,0px)`;
								}, 1);
							}

							if (move === 'down') {
								cellInsideCell.style.transform = `translate(0px ,${
									(-width + -marginOfCell * 2) * (index1 - index)
								}px)`;

								setTimeout(() => {
									cellInsideCell.style.transition =
										'transform 250ms, opacity 250ms, background-color 125ms';
									cellInsideCell.style.transform = `translate(0px ,0px)`;
								}, 1);
							}

							setTimeout(() => {
								cell1InsideCell.style.transition = 'all 0ms';
							}, 100);
						}
					}
				});
			}
		});
	});

	if (isReadyToGenerteNewCell) {
		addCellValueOf2();
		myTimeout = setTimeout(() => {
			isKeyPressed = false;
		}, 100);
	} else {
		const cellsElements = [...document.querySelectorAll('.cell')];
		const areAllCellsNotEmpty = cellsElements.every((cell) => {
			const cellValueElement = cell.querySelector('#value');
			return cellValueElement.innerHTML !== '';
		});
		if (areAllCellsNotEmpty) {
			let isGameOverX = true;
			let isGameOverY = true;
			rowsOfCells.forEach((row) => {
				row.forEach((cell, index, array) => {
					const cellValue = cell.querySelector('#value');
					if (index > 0) {
						const previousCellValue = array[index - 1].querySelector('#value');

						if (previousCellValue.innerHTML === cellValue.innerHTML && isGameOverX === true) {
							isGameOverX = false;
						}
					}
				});
			});

			columnsOfCells.forEach((column) => {
				column.forEach((cell, index, array) => {
					const cellValue = cell.querySelector('#value');
					if (index > 0) {
						const previousCellValue = array[index - 1].querySelector('#value');

						if (previousCellValue.innerHTML === cellValue.innerHTML && isGameOverY === true) {
							isGameOverY = false;
						}
					}
				});
			});
			if (isGameOverX === true && isGameOverY === true) {
				gameOver();
			}
		}
	}
};

const watchForCellChangeByInspect = () => {
	const cellsElements = document.querySelectorAll('#board .cell');
	cellsElements.forEach((cell) => {
		let lastCellValue = undefined;
		setInterval(() => {
			const cellValue = cell.querySelector('#value').innerHTML;
			lastCellValue === undefined ? (lastCellValue = cellValue) : null;
			if (lastCellValue !== cellValue && isKeyPressed === false) {
				isCheated = true;
				console.log('1');
			}

			lastCellValue = cellValue;
		}, 1000 / 30);
	});
};

watchForCellChangeByInspect();

window.addEventListener('keydown', (event) => {
	if (event.keyCode === 38 || event.key === 'ArrowUp') {
		isKeyPressed = true;
		clearTimeout(myTimeout);
		initMove('up');
	}
	if (event.keyCode === 37 || event.key === 'ArrowLeft') {
		isKeyPressed = true;
		clearTimeout(myTimeout);
		initMove('left');
	}
	if (event.keyCode === 39 || event.key === 'ArrowRight') {
		isKeyPressed = true;
		clearTimeout(myTimeout);
		initMove('right');
	}
	if (event.keyCode === 40 || event.key === 'ArrowDown') {
		isKeyPressed = true;
		clearTimeout(myTimeout);
		initMove('down');
	}
});

let firstTouchX = 0;
let firstTouchY = 0;
let isTouchDone = false;

window.addEventListener('touchstart', (event) => {
	firstTouchX = event.touches[0].clientX;
	firstTouchY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
	if (isTouchDone === false) {
		if (event.touches[0].clientX - 50 > firstTouchX) {
			isTouchDone = true;
			isKeyPressed = true;
			clearTimeout(myTimeout);
			initMove('right');
		}
		if (event.touches[0].clientX + 50 < firstTouchX) {
			isTouchDone = true;
			isKeyPressed = true;
			clearTimeout(myTimeout);
			initMove('left');
		}
		if (event.touches[0].clientY + 50 < firstTouchY) {
			isTouchDone = true;
			isKeyPressed = true;
			clearTimeout(myTimeout);
			initMove('up');
		}
		if (event.touches[0].clientY - 50 > firstTouchY) {
			isTouchDone = true;
			isKeyPressed = true;
			clearTimeout(myTimeout);
			initMove('down');
		}
	}
});

window.addEventListener('touchend', (event) => {
	firstTouchX = 0;
	firstTouchY = 0;
	isTouchDone = false;
});

window.addEventListener('DOMContentLoaded', () => {
	const bestScore = document.querySelector('#header #best-score');
	const localStorageBestScore = localStorage.getItem('bestScore') === null ? 0 : localStorage.getItem('bestScore');

	bestScore.innerHTML = `Best: ${localStorageBestScore}`;
});
