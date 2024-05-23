document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-auction");
    const outputText = document.getElementById("output");
    const playerButtonsContainer = document.getElementById("player-buttons");
    const parPriceInput = document.getElementById("par-price");
    const marginSlider = document.getElementById("margin-slider");
    const durationSelect = document.getElementById("duration");

    startButton.addEventListener("click", startAuction);

    function startAuction() {
        const price = parseInt(parPriceInput.value);
        const marginValue = parseInt(marginSlider.value);
        const duration = parseInt(durationSelect.value);

        if (isNaN(price) || isNaN(marginValue) || isNaN(duration)) {
            outputText.value = "Please enter valid numeric values.";
            return;
        }

        let margin = marginValue;
        let keyPressed = false;
        let lastPrice = 0;

        const startPrice = Math.round((price * marginValue) / 100);
        const marginMod = marginValue / (duration / 0.05);

        outputText.value = `PAR PRICE: ${price} | START PRICE: ${startPrice.toFixed(2)} | DURATION: ${duration} s\n`;
        outputText.value += "AUCTION COMMENCING.\n";

        resetButtons();

        countdown(3);

        function countdown(i) {
            if (i > 0) {
                outputText.value = `${i}`; // Overwrite the last printout
                setTimeout(() => countdown(i - 1), 1000);
            } else {
                outputText.value = `${startPrice.toFixed(2)} | ${margin} %`; // Overwrite the last printout
                setTimeout(() => startAuctionProcess(startPrice, marginMod, price), 1000);
            }
        }
    }

    function startAuctionProcess(startPrice, marginMod, parPrice) {
        auction(parPrice, marginMod);
    }

    function auction(price, marginMod) {
        let margin = parseInt(marginSlider.value);
        let keyPressed = false;
        let lastPrice = 0;

        auctionStep();

        function auctionStep() {
            if (margin > 0 && !keyPressed) {
                lastPrice = Math.round((margin / 100) * price);
                outputText.value = `${lastPrice.toFixed(2)} | ${Math.round(margin)} %`; // Overwrite the last printout
                margin -= marginMod;
                setTimeout(auctionStep, 50);
            } else if (!keyPressed) {
                outputText.value = "NO BID"; // Overwrite the last printout
                disableButtons();
            }
        }
    }

    function disableButtons() {
        // Implement disabling buttons
    }

    function resetButtons() {
        // Implement resetting buttons
    }

    // Other functions and event listeners go here
});
