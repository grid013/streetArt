fetch("https://jsonplaceholder.typicode.com/users")
.then(response => response.json())
.then(function(data){  // Renders options is every select
    allArtists = data.map(obj => obj.name)
    renderOptions(allArtists,selectJoinArtist)
    renderOptions(allArtists,filterArtists)
    renderOptions(itemTypes,type)
    renderOptions(itemTypes,newType)
})

if(!getItem("itemsLS")){ 
    updateItemsLS(items)
}

let items_LS = getItem("itemsLS")

const publishedItems = items_LS.filter(item => item.isPublished);

const onAuctionItems = items_LS.filter(item => item.isAuctioning);
window.addEventListener("hashchange", handleRouting)
window.addEventListener("load", handleRouting)

document.addEventListener("click",(e)=>{
    const {target} = e

    if(target.closest(".join-artist-wrapper")){
        joinAsArtist()

    }else if(target.closest(".join-visitor")){
        location.hash = "visitor"

    }else if(target.matches(".find-now-btn") || target.matches(".slide img")){
        location.hash = "visitor/listing"

    }
})

function handleRouting(){
    let hash = location.hash
    if(!hash) location.hash = "landingPage";
    document.querySelectorAll("section")
    .forEach(section => {
        `#${section.id}` !== hash ? section.style.display = "none" : section.style.display = "block";
    })

    let filtering = localStorage.getItem("filtering")
    switch (hash){
        case "#artistsHomePage":
            renderNavName()
            renderArtist()
            initChart()
            break;

        case "#artists/items":
            renderNavName()
            renderAllArtistCards()
            break;
        case "#artists/add-new-item":
            renderNavName()
            break;

        case "#artists/capture-image" :
            renderNavName()
            startCamera()
            break;

        case "#visitor":
            setSlidePosition(slides,slidesWrapper)
            break;

        case "#visitor/listing":
            if(!filtering || filtering === "false"){ 
                renderAllCards(publishedItems, cardsWrapper)
            }else{
                filterCards()
            }
            break;
        case '#auctionPage':
           
            onAuctionPage();
    }

}

function updateItemsLS(array){
    localStorage.setItem("itemsLS", JSON.stringify(array))
    return true
}
function updateArrIds(array){
    for (let i = 0; i < array.length; i++) {
        const idVal = i+1
        array[i].id = idVal
    }
}

