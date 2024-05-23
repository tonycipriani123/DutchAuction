document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-auction");
    const outputText = document.getElementById("output");
    const parPriceInput = document.getElementById("par-price");
    const marginSlider = document.getElementById("margin-slider");
    const durationSelect = document.getElementById("duration");
    const playerButtons = document.querySelectorAll(".player-button");

    let lastPrice = 0;
    let auctionActive = false;

    startButton.addEventListener("click", startAuction);

    playerButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (auctionActive) {
                const color = button.id;
                outputText.value = `${color} bought at ${lastPrice.toFixed(2)}`;
                auctionActive = false;
                disableButtons();
            }
        });
    });

    function startAuction() {
        const price = parseInt(parPriceInput.value);
        const marginValue = parseInt(marginSlider.value);
        const duration = parseInt(durationSelect.value);

        if (isNaN(price) || isNaN(marginValue) || isNaN(duration)) {
            outputText.value = "Please enter valid numeric values.";
            return;
        }

        let margin = marginValue;
        auctionActive = true;

        const startPrice = Math.round((price * marginValue) / 100);
        const marginMod = marginValue / (duration / 0.05);

        outputText.value = `PAR PRICE: ${price} | START PRICE: ${startPrice.toFixed(2)} | DURATION: ${duration} s\n`;
        outputText.value += "AUCTION COMMENCING.\n";

        resetButtons();
        countdown(3, () => {
            outputText.value = `${startPrice.toFixed(2)} | ${margin} %`;
            startAuctionProcess(startPrice, marginMod, price);
        });
    }

    function countdown(i, callback) {
        if (i > 0) {
            outputText.value = `${i}`;
            setTimeout(() => countdown(i - 1, callback), 1000);
        } else {
            callback();
        }
    }

    function startAuctionProcess(startPrice, marginMod, parPrice) {
        auction(parPrice, marginMod);
    }

    function auction(price, marginMod) {
        let margin = parseInt(marginSlider.value);
        auctionActive = true;

        auctionStep();

        function auctionStep() {
            if (margin > 0 && auctionActive) {
                lastPrice = Math.round((margin / 100) * price);
                outputText.value = `${lastPrice.toFixed(2)} | ${Math.round(margin)} %`;
                margin -= marginMod;
                setTimeout(auctionStep, 50);
            } else if (auctionActive) {
                outputText.value = "NO BID";
                disableButtons();
                auctionActive = false;
            }
        }
    }

    function disableButtons() {
        playerButtons.forEach(button => {
            button.disabled = true;
        });
    }

    function resetButtons() {
        playerButtons.forEach(button => {
            button.disabled = false;
        });
    }
});
