const button = document.querySelector("button")
const Input = document.querySelector("#Search")
const Display = document.querySelector(".Display")

const ButtonHover = () => {
    button.addEventListener('mouseover', () => {
        button.classList.add('SearchButtonOnHover')
    })
    button.addEventListener('mouseout', () => {
        button.classList.remove('SearchButtonOnHover')
    })
}
ButtonHover();

const search = async (f) => {
    Display.classList.remove("NoShows")
    Display.replaceChildren([]);
    const InputV = Input.value
    try {
        f.preventDefault();
        if (InputV !== "") {
            const config = {params: {q: f = InputV}}
            const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
            await loadingEffect();
            setTimeout(async () => {
                await makeImages(res.data)
                button.disabled = false;
            }, 1002)

        } else {
            Input.placeholder = "Enter Something"
        }
    } catch (e) {
        console.log(`Error API Down `, e)
    }
}
const makeImages = async (links) => {
    if (links.length !== 0) {
        for (let link of links) {
            if (link.show.image) {
                button.classList.remove("fail");
                const Img = document.createElement("img");
                const Card = document.createElement("div")
                const ImgDiv = document.createElement("div")
                const details = document.createElement("div")
                Img.src = link.show.image.medium
                await rating(link, ImgDiv, Card)
                details.innerText += `${link.show.name}`
                Card.addEventListener('click', () => {
                    window.open(`https://www.imdb.com/title/${link.show.externals.imdb}`, '_blank');
                })
                details.classList.add("InvisibleText")
                Card.classList.add("Card")
                Card.append(details, Img)
                Display.append(Card)

                await HoverOn(Card, Img, details, ImgDiv);
                await HoverOff(Card, Img, details, ImgDiv);
            }
        }

    } else {
        button.classList.add("fail");
        const h2 = document.createElement("h2")
        const span = document.createElement("span")
        h2.innerText = "No Shows Found :("
        span.innerText = "Try Finding Some Other Shows"
        Display.append(h2, span)
        Display.classList.add("NoShows")
    }

}
const rating = (link, ImgDiv, Card) => {
    if (link.show.rating.average != null) {
        const X = link.show.rating.average
        const rating = Math.round(X * 5 / 10)
        for (i = 0; i < rating; i++) {
            const Image = document.createElement("img");
            Image.src = `Star.svg`;
            ImgDiv.append(Image)
            ImgDiv.classList.add("InvisibleText", "Star")
            Card.append(ImgDiv)
        }

    } else {
        ImgDiv.innerText = "Ratings Not Available"
        ImgDiv.classList.add("rating", "Star")
        Card.append(ImgDiv)
    }
}
const HoverOn = async (Card, Img, details, ImgDiv) => {
    Card.addEventListener('mouseover', () => {
        Img.classList.add("opacity");
        details.classList.add("visible");
        ImgDiv.classList.add("visible");

    })
}
const HoverOff = async (Card, Img, details, ImgDiv) => {
    Card.addEventListener('mouseout', () => {
        Img.classList.remove("opacity");
        details.classList.remove("visible");
        ImgDiv.classList.remove("visible");

    })
}
const loadingEffect = async () => {
    button.disabled = true;
    await Display.classList.add('DisplayFor_loading')
    const load = document.createElement('div')
    load.classList.add('Loading')
    Display.append(load)
    setTimeout(() => {
        load.remove();
        Display.classList.remove('DisplayFor_loading')
        Display.replaceChildren([]);
    }, 1002)
}

button.addEventListener('click', search)
