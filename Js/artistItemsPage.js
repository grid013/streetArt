const artistItemsPage = document.getElementById("artists/items");
const allCardsWrapper = document.getElementById("artist_cards");
const overlay = document.querySelector(".confirm-screen-overlay");
const confirmPopUp = document.querySelector(".confirm-popup");
const addNewItemButton = document.querySelector(".add-new-item");

let editingItem = "";
let editingItemNode;
let editingItemIndex;
let editingFlag = false;

const createButton = (className, textContent) => {
    const button = document.createElement("button");
    button.classList.add(className);
    button.textContent = textContent;
    return button;
};

const renderArtistCard = (id, imgUrl, itemTitle, date, price, desc, published) => {
    const cardWrapper = document.createElement("div");
    const card = document.createElement("div");
    const cardButtons = document.createElement("div");

    cardWrapper.classList.add("card-wrapper");
    cardWrapper.setAttribute("id", id);
    card.classList.add("card", "light");
    cardButtons.classList.add("card-btns");

    const sendToAucBtn = createButton("send-to-auc", "Send to Auction");
    const publishBtn = createButton(published ? "unpublish" : "publish", published ? "Unpublish" : "Publish");
    const removeBtn = createButton("remove", "Remove");
    const editBtn = createButton("edit", "Edit");

    const cardInner = `
        <img src="${imgUrl}" alt="art-image">
        <div class="card-text">
            <div class="name-price">
                <div>
                    <h5 class="item-title">${itemTitle}</h5>
                    <p class="datum">${date}</p>
                </div>
                <span class="price">$${price}</span>
            </div>
            <p class="desc">${desc}</p>
        </div>
    `;

    allCardsWrapper.append(cardWrapper);
    cardWrapper.append(card);
    card.innerHTML += cardInner;
    card.append(cardButtons);
    cardButtons.append(sendToAucBtn, publishBtn, removeBtn, editBtn);

    const items_LS = getItem("itemsLS");

    if (items_LS.filter(item => item.priceSold).length > 0) {
        sendToAucBtn.setAttribute("disabled", "true");
    } else {
        sendToAucBtn.removeAttribute("disabled");
        sendToAucBtn.style.background = "#188DE6";
    }

    sendToAucBtn.addEventListener('click', () => {
        const idx = items_LS.findIndex(item => item.id == id);
        items_LS[idx].isPublished = !items_LS[idx].isPublished;
        updateItemsLS(items_LS);
    });
};

const renderAllArtistCards = () => {
    allCardsWrapper.innerHTML = "";
    const artistName = localStorage.getItem("artist");
    const items_LS = getItem("itemsLS");

    const artistItems = items_LS ? items_LS.filter(item => item.artist === artistName) :
        items.filter(item => item.artist === artistName);

    artistItems.forEach(item => {
        const date = new Date(item.dateCreated).toLocaleDateString("en-GB");
        renderArtistCard(item.id, item.image, item.title, date, item.price, item.description, item.isPublished);
    });
};

allCardsWrapper.addEventListener('click', (e) => {
    const { target } = e;
    if (target.nodeName !== 'BUTTON') return;

    const actionItem = target.closest(".card-wrapper");
    const actionItemId = actionItem.id;
    const itemIndex = items_LS.findIndex(item => item.id === +actionItemId);
    localStorage.setItem("itemID", actionItemId);

    if (target.matches(".remove")) {
        overlay.classList.add("active");
        confirmPopUp.classList.add("active");
    } else if (target.matches(".publish")) {
        target.classList.replace("publish", "unpublish");
        target.textContent = "Unpublish";
        items_LS[itemIndex].isPublished = true;
    } else if (target.matches(".unpublish")) {
        target.classList.replace("unpublish", "publish");
        target.textContent = "Publish";
        items_LS[itemIndex].isPublished = false;
    } else if (target.matches(".edit")) {
        editingFlag = true;
        editingItem = items_LS[itemIndex];
        editingItemNode = actionItem;
        editingItemIndex = itemIndex;
        location.hash = "artists/add-new-item";
        initEditMode();
    } else if (target.matches('.send-to-auc')) {
        items_LS[itemIndex].isAuctioning = true;
    }
    updateItemsLS(items_LS);
});

confirmPopUp.addEventListener("click", (e) => {
    const { target } = e;
    const itemID = localStorage.getItem("itemID");
    const itemToRemove = document.getElementById(itemID);
    const itemIndex = items_LS.findIndex(item => item.id === +itemID);

    if (target.matches(".cancel")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");
    } else if (target.matches(".confirm")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");
        itemToRemove.remove();

        items_LS.splice(itemIndex, 1);
        updateArrIds(items_LS);
        updateItemsLS(items_LS);
        renderAllArtistCards();
    }
});

addNewItemButton.addEventListener("click", clearItemInputs);
