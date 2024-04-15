// Функция для инициализации функционала изменения размера столбцов таблицы
(function initColumnResize() {

    // Объявление переменных для управления изменением размера столбцов
    var col_element, next_element, cursorStart = 0, dragStart = false, width, height, th_width, next_width = undefined, next_height, resize, resize_left, table_wt, resizeCheck;
    // Получение ссылок на необходимые элементы DOM
    var container = document.getElementById("container"),
        table = document.getElementById("table_resize"),
        table_th = table.getElementsByTagName("th"),
        bodyRect = document.body.getBoundingClientRect();

    // Установка позиционирования контейнера в "relative"
    container.style.position = "relative";

    // Обработчик события "mousedown" для начала изменения размера столбца
    function mouseDown() {
        // Установка текущего элемента для изменения размера
        resize = this;
        resizeCheck = resize.classList.contains("y_resize");
        var col_index = parseInt(resize.getAttribute("data-resizecol")) - 1;
        col_element = table_th[col_index];
        next_element = table_th[col_index + 1];
        dragStart = true;
        cursorStart = (resizeCheck) ? event.pageX : event.pageY;
        var elm_bound = col_element.getBoundingClientRect();
        width = elm_bound.width;
        table_wt = table.offsetWidth;
        if (next_element != undefined) {
            var next_bound = next_element.getBoundingClientRect();
            next_width = next_bound.width;
        }
        resize_left = (this.getBoundingClientRect()).left - bodyRect.left;
    }

    // Обработчик события "mousemove" для изменения размера столбца в процессе перетаскивания
    function mouseMove(event) {
        if (dragStart) {
            var cursorPosition = (resizeCheck) ? event.pageX : event.pageY;
            var mouseMoved = (cursorPosition - cursorStart);
            var newLeft = resize_left + mouseMoved;
            var newWidth = width + mouseMoved;
            var new_nextWidth, new_nextHeight;
            if (next_element != undefined) {
                new_nextWidth = next_width - mouseMoved;
            }
            if (newWidth > 30 && (new_nextWidth > 30 || next_element == undefined)) {
                col_element.style.cssText = "width: " + newWidth + "px;";
                if (next_element != undefined) {
                    next_element.style.cssText = "width: " + new_nextWidth + "px";
                }
                else {
                    table.style.width = (table_wt + mouseMoved) + "px";
                }
                resize.style.cssText = "left: " + newLeft + "px;";
            }
        }
    }

    // Обработчик события "mouseup" для завершения изменения размера столбца
    function mouseUp() {
        if (dragStart) {
            dragStart = false;
        }
    }

    // Инициализация обработчиков событий для начала, изменения и завершения изменения размера столбца
    function initEvents() {
        var tb_resize = container.getElementsByClassName("tb_resize");
        var th_length = table_th.length;
        for (var i = 0; i < th_length; i++) {
            tb_resize[i].addEventListener("mousedown", mouseDown);
        }
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    }

    // Вычисление ширины столбцов таблицы
    function setTdWidth() {
        var elm_bound = table.getBoundingClientRect();
        var table_wt = elm_bound.width;
        var th_length = table_th.length;
        th_width = table_wt / th_length;
    }

    // Создание div'ов для изменения размера столбцов таблицы
    function createResizeDiv() {
        var cont = document.getElementById("container");
        var th_length = table_th.length;
        for (var i = 1; i <= th_length; i++) {
            var yDiv = document.createElement("div");
            yDiv.className = "y_resize tb_resize";
            yDiv.setAttribute("data-resizecol", i);
            var col_index = i - 1;
            var col_width;
            if (col_index >= 0 && col_index < table_th.length) {
                col_width = table_th[col_index].offsetWidth;
            } else {
                console.error("Column index out of bounds:", col_index);
                return;
            }
            var next_col_width;
            if (col_index + 1 < table_th.length) {
                next_col_width = table_th[col_index + 1].offsetWidth;
            }
            var leftPos = col_width + table_th[col_index].getBoundingClientRect().left - cont.getBoundingClientRect().left;
            yDiv.style.left = leftPos + "px";
            cont.appendChild(yDiv);
        }
    }

    // Вызов функций для инициализации
    setTdWidth();
    createResizeDiv();
    initEvents();
})();
