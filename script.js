
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
			this.speedX = (this.game.mouse.x - this.collisionX) / 20;
			this.speedY = (this.game.mouse.y - this.collisionY) / 20;

			this.collisionX += this.speedX;
			this.collisionY += this.speedY;
		}
	}


	class Game {
		constructor(canvas) {
			this.canvas = canvas;
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.player = new Player(this);
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
				this.mouse.x = e.offsetX;
				this.mouse.y = e.offsetY;


			});
		}
		//метод обновляем и рисуем все объекты в игре
		render(context) {
			this.player.draw(context);
			this.player.update();
		}
	}

	const game = new Game(canvas);



	function animate() {
		//очищаем предыдущу залвку круга
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.render(ctx);
		requestAnimationFrame(animate);
	}
	animate();
});