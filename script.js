
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
			//извлекаем из game свойства и присваиваем коллизии центр круга героя
			this.collisionX = this.game.width * 0.5;
			this.collisionY = this.game.height * 0.5;
			this.collisionRadius = 30;
			//устанавливаем начальную скорость игрока
			this.speedX = 0;
			this.speedY = 0;

			this.dx = 0;
			this.dy = 0;

			this.speedModifier = 5;
			this.spriteWidth = 255;
			this.spriteHeight = 255;
			this.width = this.spriteWidth;
			this.height = this.spriteHeight;
			// верхний левй угол картинки игрока
			this.spriteX;
			this.spriteY;

			this.frameX = 0;
			this.frameY = 0;

			this.image = document.getElementById('bull');
		}
		//рисует игрок
		draw(context) {
			context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
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

			//АНИМИРУЕМ ПЕРСОНАЖА

			//движение линии за объектом
			//ось x
			this.dx = this.game.mouse.x - this.collisionX;
			//ось y
			this.dy = this.game.mouse.y - this.collisionY;
			//Метод Math.atan2() возвращает арктангенс от частного своих аргументов.
			const angle = Math.atan2(this.dy, this.dx);

			if (angle < -2.74 || angle > 2.74) this.frameY = 6;
			else if (angle < -1.96) this.frameY = 7;
			else if (angle < -1.17) this.frameY = 0;
			else if (angle < -0.39) this.frameY = 1;
			else if (angle < 0.39) this.frameY = 2;
			else if (angle < 1.17) this.frameY = 3;
			else if (angle < 1.96) this.frameY = 4;
			else if (angle < 2.74) this.frameY = 5;


			console.log(angle);



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
			this.spriteX = this.collisionX - this.width * 0.5;
			this.spriteY = this.collisionY - this.height * 0.5 - 100;

			//берём массив из obstacles перебираем его в функции obstacle
			//выводим в консоль метод checkCollision
			this.game.obstacles.forEach(obstacle => {
				//[(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
				//применяем диструктуризацию массива
				let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
				//создаём переменную со значением индекса this.game.checkCollision

				//let collision1 = game.checkCollision(this, obstacle)[0];
				//let distance = game.checkCollision(this, obstacle)[1];

				//выталкиеваем курсор на один пиксель за радиус круга препятствия
				if (collision) {
					const unit_y = dx / distance;
					const unit_x = dy / distance;
					this.collisionX = obstacle.collisionX +
						(sumOfRadii + 1) * unit_x;
					this.collisionY = obstacle.collisionY +
						(sumOfRadii + 1) * unit_y;
				}
			})
		}
	}

	class Obstacle {
		constructor(game) {
			this.game = game;
			this.collisionX = Math.random() * this.game.width;
			this.collisionY = Math.random() * this.game.width;
			this.collisionRadius = 60;
			//добавляем спрайт
			this.image = document.getElementById('obstacles');
			this.spriteWidth = 250;
			this.spriteHeight = 250;
			this.width = this.spriteWidth;
			this.height = this.spriteHeight;
			//центруем героя по картинке
			this.spriteX = this.collisionX - this.width * 0.5;
			this.spriteY = this.collisionY - this.height * 0.5 - 70;


			this.frameX = Math.floor(Math.random() * 4);
			this.frameY = Math.floor(Math.random() * 3);
		}
		draw(context) {
			// рисуем изображение в точках коллизии(рисунок)(рисунок.позиц x,позиц y,ширина.высота.координаты.
			context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteHeight, this.spriteWidth, this.spriteX, this.spriteY, this.width, this.height);
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
			this.topMargin = 260;
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
			this.obstacles.forEach(obstacle => obstacle.draw(context));
			this.player.draw(context);
			this.player.update();

		}

		//метод проверки столновений принимает объекты a,b вернёт true or false

		checkCollision(a, b) {
			const dx = a.collisionX - b.collisionX;
			const dy = a.collisionY - b.collisionY;
			const distance = Math.hypot(dy, dx);
			const sumOfRadii = a.collisionRadius + b.collisionRadius;
			//возвращаем массив правда или лож, возвращаем дистанцию 185
			return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
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
					const distanceBuffed = 150;
					const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffed;
					if (distance < sumOfRadii) {
						overlap = true;
					}
				});
				const margin = testObstacle.collisionRadius * 2;
				if (!overlap && testObstacle.spriteX > 0 &&
					testObstacle.spriteX < this.width -
					testObstacle.width && testObstacle.collisionY >
					this.topMargin + margin &&
					testObstacle.collisionY < this.height - margin) {
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

49.13