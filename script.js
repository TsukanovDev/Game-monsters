
//функция загрузки игры
window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 1280;
	canvas.height = 720;
	//переопределяем цвет круга
	ctx.fillStyle = 'white';
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';




	class Player {
		constructor(game) {
			this.game = game;
			//извлекаем из game свойства и присваиваем коллизии
			this.collisionX = this.game.width * 0.5;
			this.collisionY = this.game.height * 0.5;
			this.collisionRadius = 30;
			//устанавливаем начальную скорость игрока
			this.speedX = 0;
			this.speedY = 0;
			this.speedModifier = 20;
		}
		//рисует игрок
		draw(context) {
			//запускает новый путь, очищая список вложенных путей.
			context.beginPath();
			//Метод Canvas 2D API добавляет дугу окружности к текущему подпути.
			context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
			//Если путь не закрыт, метод fill() добавит линию от последней точки до начальной точки пути, 
			//чтобы закрыть путь (как closePath()), а затем заполнит путь.
			context.save();//сохраняем свойства fill
			context.globalAlpha = 0.5;
			context.fill();
			context.restore();//отменяем свойства globalAlpha в дальнейшем
			context.stroke();
			//начинаем путь
			context.beginPath();
			//линия начинается с координаты игрока
			context.moveTo(this.collisionX, this.collisionY);
			context.lineTo(this.game.mouse.x, this.game.mouse.y);
			//РИСУЕМ ЛИНИЮ
			context.stroke();

		}
		update() {
			//движение линии за объектом
			//ось x
			this.dx = this.game.mouse.x - this.collisionX;
			//ось y
			this.dy = this.game.mouse.y - this.collisionY;
			//постоянная скорость героя
			//высчитываеи гипотенузу
			const distance = Math.hypot(this.dy, this.dx);


			if (distance > this.speedModifier) {
				this.speedX = this.dx / distance || 0;
				this.speedY = this.dy / distance || 0;
			} else {
				this.speedX = 0;
				this.speedY = 0;
			}



			this.collisionX += this.speedX * this.speedModifier;
			this.collisionY += this.speedY * this.speedModifier;
		}
	}

	class Obstacle {
		constructor(game) {
			this.game = game;
			this.collisionX = Math.random() * this.game.width;
			this.collisionY = Math.random() * this.game.width;
			this.collisionRadius = 100;
		}
		draw(context) {
			//запускает новый путь, очищая список вложенных путей.
			context.beginPath();
			//Метод Canvas 2D API добавляет дугу окружности к текущему подпути.
			context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
			//Если путь не закрыт, метод fill() добавит линию от последней точки до начальной точки пути, 
			//чтобы закрыть путь (как closePath()), а затем заполнит путь.
			context.save();//сохраняем свойства fill
			context.globalAlpha = 0.5;
			context.fill();
			context.restore();//отменяем свойства globalAlpha в дальнейшем
			context.stroke();
			//начинаем путь
			//context.beginPath();
			//линия начинается с координаты игрока
			//context.moveTo(this.collisionX, this.collisionY);
			//context.lineTo(this.game.mouse.x, this.game.mouse.y);
			//РИСУЕМ ЛИНИЮ
			//context.stroke();
		}
	}





	class Game {
		constructor(canvas) {
			this.canvas = canvas;
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.player = new Player(this);
			//начальное количесво припятствий
			this.numberOfObstscles = 10;
			this.obstacles = [];

			this.mouse = {
				x: this.width * 0.5,
				y: this.height * 0.5,
				pressed: false
			}

			//event listener
			//получаем координаты мыши при нажатии
			canvas.addEventListener('mousedown', (e) => {
				this.mouse.x = e.offsetX;
				this.mouse.y = e.offsetY;
				this.mouse.pressed = true;
			});
			canvas.addEventListener('mouseup', (e) => {
				this.mouse.x = e.offsetX;
				this.mouse.y = e.offsetY;
				this.mouse.pressed = false;
			});
			//получаем координаты мыши при передвижении
			canvas.addEventListener('mousemove', (e) => {
				//обновлять положение мыши талько в том случае если мышь нажата
				if (this.mouse.pressed) {
					this.mouse.x = e.offsetX;
					this.mouse.y = e.offsetY;
				}



			});
		}
		//метод обновляем и рисуем все объекты в игре
		render(context) {
			this.player.draw(context);
			this.player.update();
			this.obstacles.forEach(obstacle => obstacle.draw(context));
		}
		// берём массив и добавляем в конец новое препятствие
		init() {
			//for (let i = 0; i < this.numberOfObstscles; i++)
			//	this.obstacles.push(new Obstacle(this));
			// цыклом проверяем сколько кругов влезет в область не задевая уже созданные препятствия

			let attemps = 0;
			while (this.obstacles.length < this.numberOfObstscles && attemps < 500) {
				let testObstacle = new Obstacle(this);
				let overlap = false;
				this.obstacles.forEach(obstacle => {
					const dx = testObstacle.collisionX - obstacle.collisionX;
					const dy = testObstacle.collisionY - obstacle.collisionY;
					const distance = Math.hypot(dy, dx);
					const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
					if (distance < sumOfRadii) {
						overlap = true;
					}
				});
				if (!overlap) {
					this.obstacles.push(testObstacle);
				}
				attemps++;
			}
		}
	}

	const game = new Game(canvas);
	game.init();
	console.log(game);


	function animate() {
		//очищаем предыдущу залвку круга
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.render(ctx);
		requestAnimationFrame(animate);
	}
	animate();
});