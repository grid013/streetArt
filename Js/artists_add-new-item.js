const addItemH1 = document.querySelector(".title-checkbox h2");
const published = document.getElementById("is_published");
const newTitle = document.getElementById("new-item_title");
const newDesc = document.getElementById("new-item_desc");
const newType = document.getElementById("new-item_type");
const newPrice = document.getElementById("new-item_price");
const newImgUrl = document.getElementById("new-item_img-url");
const newUploadedImg = document.getElementById("file-input");
const addBtn = document.querySelector(".add-cancel-btns .add-btn");
const cancelBtn = document.querySelector(".add-cancel-btns .cancel-btn");
const dispImgWrapper = document.querySelector(".displayed-img-wrapper");
const newImgDisplayed = document.getElementById("new-img-displayed");
const delImgBtn = document.querySelector(".del-img-btn");
const alertScreenOverlay = document.querySelector(".alert-screen-overlay");
const alertPopup = document.querySelector(".alert-popup");
const alertReadBtn = document.querySelector(".alert-read-btn");
const alertText = document.querySelector(".alert-text");
const cameraBtn = document.querySelector(".take-snapshot");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const takePhotoBtn = document.getElementById("snap");

const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
let ImgBase64;
let editingBase64 = false;

const createNewItem = (imgSrc, dateSold = "", priceSold = 0) => ({
    id: "",
    title: newTitle.value,
    description: newDesc.value,
    type: newType.value,
    image: imgSrc,
    price: newPrice.value,
    artist: localStorage.getItem("artist"),
    dateCreated: new Date().toISOString(),
    isPublished: published.checked,
    isAuctioning: false,
    dateSold,
    priceSold
});

const addNewItem = () => {
    let newItem;

    if (newTitle.value && newDesc.value && newType.value && newPrice.value &&
        (newImgUrl.value || ImgBase64 || editingItem.image)) {

        if (newImgUrl.value && !ImgBase64 && !editingFlag) {
            newItem = createNewItem(newImgUrl.value);
        } else if (ImgBase64 && !editingBase64 && !newImgUrl.value) {
            newItem = createNewItem(ImgBase64);
        } else if (editingBase64 && ImgBase64 && !newImgUrl.value) {
            newItem = createNewItem(ImgBase64, editingItem.dateSold, editingItem.priceSold);
        } else if (editingFlag && newImgUrl.value && !ImgBase64) {
            newItem = createNewItem(newImgUrl.value, editingItem.dateSold, editingItem.priceSold);
        } else {
            showAlert("Please choose only one: Image Url or Upload image");
            return;
        }
    } else {
        showAlert("Please make sure all fields have been entered");
        return;
    }

    if (editingFlag) {
        items_LS.splice(editingItemIndex, 1);
        editingItemNode.remove();
        editingFlag = false;
        editingBase64 = false;
    }

    items_LS.unshift(newItem);
    updateArrIds(items_LS);
    updateItemsLS(items_LS);
    location.hash = "artists/items";
    clearItemInputs();
};

const readFile = () => {
    if (!newUploadedImg.files || !newUploadedImg.files[0]) return;
    const FR = new FileReader();
    FR.addEventListener("load", ev => {
        dispImgWrapper.style.display = "block";
        newImgDisplayed.src = ev.target.result;
        ImgBase64 = ev.target.result;
    });
    FR.readAsDataURL(newUploadedImg.files[0]);
};

const clearItemInputs = () => {
    newTitle.value = "";
    newDesc.value = "";
    newType.value = "";
    newPrice.value = "";
    newImgUrl.value = "";
    newUploadedImg.value = "";
    newImgDisplayed.src = "";
    dispImgWrapper.style.display = "none";
    ImgBase64 = "";
    addItemH1.textContent = "Add new Item";
    addBtn.textContent = "Add new Item";
    editingFlag = false;
};

const initEditMode = () => {
    addItemH1.textContent = "Edit Item";
    addBtn.textContent = "Save";
    published.checked = editingItem.isPublished;
    newTitle.value = editingItem.title;
    newDesc.value = editingItem.description;
    newType.value = editingItem.type;
    newPrice.value = editingItem.price;

    editingBase64 = true;

    if (base64regex.test(editingItem.image.split(",")[1])) {
        ImgBase64 = editingItem.image;
        newImgDisplayed.src = editingItem.image;
        dispImgWrapper.style.display = "block";
    } else {
        checkUrl(editingItem.image).then(res => {
            if (res) {
                newImgDisplayed.src = editingItem.image;
                dispImgWrapper.style.display = "block";
            }
        });
        newImgUrl.value = editingItem.image;
    }
};

async function checkUrl(url) {
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith('image/');
}

const showAlert = (message) => {
    alertScreenOverlay.classList.add("active");
    alertPopup.classList.add("active");
    alertText.textContent = message;
    alertReadBtn.addEventListener("click", () => {
        alertScreenOverlay.classList.remove("active");
        alertPopup.classList.remove("active");
    });
};

const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.play();
        });
    }
};

takePhotoBtn.addEventListener("click", () => {
    context.drawImage(video, 0, 0, 720, 420);
    const dataURL = canvas.toDataURL('image/jpeg', 0.5);
    ImgBase64 = dataURL;
    newImgDisplayed.src = ImgBase64;
    dispImgWrapper.style.display = "block";
    location.hash = "artists/add-new-item";

    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop());  //Stops camera from recording
});

addBtn.addEventListener("click", addNewItem);

cancelBtn.addEventListener("click", () => {
    clearItemInputs();
    location.hash = "artists/items";
});

newUploadedImg.addEventListener("change", readFile);

delImgBtn.addEventListener("click", () => {
    newImgDisplayed.src = "";
    dispImgWrapper.style.display = "none";
    newUploadedImg.value = "";
    ImgBase64 = "";
    if (editingItem) {
        editingItem.image = "";
        newImgUrl.value = "";
    }
});


