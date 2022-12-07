const tasks = [
    {
        id: "1138465078061",
        completed: false,
        text: "Посмотреть новый урок по JavaScript",
    },
    {
        id: "1138465078062",
        completed: false,
        text: "Выполнить тест после урока",
    },
    {
        id: "1138465078063",
        completed: false,
        text: "Выполнить ДЗ после урока",
    },
];

const elementFactory = (element, parameters, parent) => {
    const el = document.createElement(element);
    if (parameters.className)
        Array.isArray(parameters.className)
            ? parameters.className.forEach(i => el.classList.add(i))
            : el.className = parameters.className;
    if (parameters.dataset)
        el.dataset[parameters.dataset.name] = parameters.dataset.value;
    if (parameters.type)
        el.type = parameters.type;
    if (parameters.id)
        el.id = parameters.id;
    if (parameters.htmlFor)
        el.htmlFor = parameters.htmlFor;
    if (parameters.text)
        el.textContent = parameters.text;
    if (!parent)
        return el
    else
        Array.from(document.querySelectorAll(parent)).at(-1).append(el);
}

const createItems = (id, text) => {
    elementFactory("div", {
        className: "task-item",
        dataset: {
            name: "taskId",
            value: id
        }
    }, ".tasks-list");
    elementFactory("div", {
        className: "task-item__main-container"
    }, ".task-item");
    elementFactory("div", {
        className: "task-item__main-content"
    }, ".task-item__main-container");
    elementFactory("form", {
        className: "task-item__form"
    }, ".task-item__main-content");
    elementFactory("input", {
        className: "checkbox-form__checkbox",
        type: "checkbox",
        id: `task-${id}`
    }, ".task-item__form");
    elementFactory("label", {
        htmlFor: `task-${id}`
    }, ".task-item__form");
    elementFactory("span", {
        className: "task-item__text",
        text
    }, ".task-item__main-content");
    elementFactory("button", {
        className: ["task-item__delete-button", "default-button", "delete-button"],
        dataset: {
            name: "deleteTaskId",
            value: id
        },
        text: "Удалить"
    }, ".task-item__main-container");
}

let flagLightOrDark = false;
const lightOrDarkTheme = flag => {
    flag
        ? document.body.style.background = "#24292E"
        : document.body.style.background = "initial";
    document.querySelectorAll(".task-item")
        .forEach(el => flag
            ? el.style.color = "#fff"
            : el.style.color = "initial");
    document.querySelectorAll("button")
        .forEach(button => flag
            ? button.style.border = "1px solid #fff"
            : button.style.border = "none");
}
document.addEventListener("keydown", event => {
    if (event.key === "Tab") {
        flagLightOrDark = !flagLightOrDark;
        lightOrDarkTheme(flagLightOrDark);
    }
})

const tasksList = document.querySelector(".tasks-list");
const addItems = () => {
    tasks.forEach(task => createItems(task.id, task.text));
    lightOrDarkTheme(flagLightOrDark);
}
addItems();

const createTaskBlock = document.querySelector(".create-task-block");
const spanError = document.createElement("span");

const removeErrorMessage = () => {
    document.querySelector(".error-message-block")
        ? spanError.remove()
        : spanError.className = "error-message-block";
}

const validations = text => {
    removeErrorMessage();
    if (!text || tasks.some(i => i.text === text)) {
        !text
            ? spanError.textContent = "Название задачи не должно быть пустым."
            : spanError.textContent = "Задача с таким названием уже существует."
        createTaskBlock.prepend(spanError);
        return false;
    }
    return true;
}

createTaskBlock.addEventListener("submit", event => {
    event.preventDefault();
    const textToAdd = event.target.taskName.value
    if (validations(textToAdd)) {
        tasks.unshift({id: `${Date.now()}`, completed: false, text: textToAdd});
        tasksList.replaceChildren();
        addItems();
        lightOrDarkTheme(flagLightOrDark);
    }
})

const createModalWindow = () => {
    const modalOverlay = elementFactory("div", {
        className: ["modal-overlay", "modal-overlay_hidden"]
    });
    const deleteModal = elementFactory("div", {
        className: "delete-modal"
    });
    modalOverlay.append(deleteModal);
    const question = elementFactory("h3", {
        className: "delete-modal__question",
        text: "Вы действительно хотите удалить эту задачу?"
    });
    deleteModal.append(question);
    const divButtons = elementFactory("div", {
        className: "delete-modal__buttons"
    });
    deleteModal.append(divButtons);
    const cancelButton = elementFactory("button", {
        className: ["delete-modal__button", "delete-modal__cancel-button"],
        text: "Отмена"
    });
    divButtons.append(cancelButton);
    const confirmButton = elementFactory("button", {
        className: ["delete-modal__button", "delete-modal__confirm-button"],
        text: "Удалить"
    })
    divButtons.append(confirmButton);
    return modalOverlay;
}

const modalWindow = createModalWindow();
document.body.appendChild(modalWindow);
let isDeleteButton;
tasksList.addEventListener("click", event => {
    isDeleteButton = event.target.closest(".delete-button");
    if (isDeleteButton) {
        removeErrorMessage();
        modalWindow.classList.toggle("modal-overlay_hidden");
    }
})

const deleteModalButtons = document.querySelector(".delete-modal__buttons");
deleteModalButtons.addEventListener("click", event => {
    const isButton = event.target.closest(".delete-modal__button");
    if (isButton && event.target.classList.contains("delete-modal__cancel-button"))
        modalWindow.classList.toggle("modal-overlay_hidden");
    if (isButton && event.target.classList.contains("delete-modal__confirm-button")) {
        for (let i = 0; i < tasks.length; i++)
            if (tasks[i].id === isDeleteButton.dataset.deleteTaskId) {
                tasks.splice(i, 1);
                break;
            }
        modalWindow.classList.toggle("modal-overlay_hidden");
        tasksList.replaceChildren();
        tasks.forEach(i => createItems(i.id, i.text));
        lightOrDarkTheme(flagLightOrDark);
    }
})

