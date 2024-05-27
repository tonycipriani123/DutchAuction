let parPrice;
let currentPrice;
let currentMargin;
let margin;
let auctionDuration;
let decrement;
const minPrice = 0;
let auctionActive = true;
let auctionTimer;
let remainingTime;
const progressBar = document.getElementById('progressBar');

document.getElementById('startAuctionButton').addEventListener('click', startCountdown);
document.getElementById('resetButton').addEventListener('click', resetAuction);
document.querySelectorAll('.bid-button').forEach(button => {
    button.addEventListener('click', placeBid);
});
document.getElementById('timer').addEventListener('input', function() {
    document.getElementById('timerValue').textContent = this.value;
});

function startCountdown() {
    let countdown = 3;
    parPrice = parseFloat(document.getElementById('parPrice').value);
    margin = parseFloat(document.getElementById('margin').value);
    currentPrice = parPrice * (margin / 100);
    currentMargin = margin;

    // Reset progress bar
    progressBar.style.width = '100%';
    
    document.getElementById('countdown').textContent = countdown;
    document.getElementById('currentPrice').textContent = `Current Price: ${Math.ceil(currentPrice)}`;
    document.getElementById('currentMargin').textContent = `Current Margin: ${Math.ceil(currentMargin)}%`;

    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('auctionScreen').style.display = 'block';
    
    const countdownTimer = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            document.getElementById('countdown').textContent = countdown;
        } else {
            clearInterval(countdownTimer);
            document.getElementById('countdown').textContent = '';
            startAuction();
        }
    }, 1000);
}

function startAuction() {
    auctionDuration = parseFloat(document.getElementById('timer').value);
    decrement = (currentPrice - minPrice) / (auctionDuration * 20); // Adjusted for higher tick rate
    remainingTime = auctionDuration * 1000; // Convert seconds to milliseconds

    document.getElementById('currentPrice').textContent = `Current Price: ${Math.ceil(currentPrice)}`;
    document.getElementById('currentMargin').textContent = `Current Margin: ${Math.ceil(currentMargin)}%`;
    updateProgressBar();

    auctionActive = true;
    auctionTimer = setInterval(updatePrice, 50); // Update every 50ms
}

function updatePrice() {
    if (currentPrice > minPrice && auctionActive) {
        currentPrice -= decrement;
        currentMargin = (currentPrice / parPrice) * 100;
        remainingTime -= 50;

        document.getElementById('currentPrice').textContent = `Current Price: ${Math.ceil(currentPrice)}`;
        document.getElementById('currentMargin').textContent = `Current Margin: ${Math.ceil(currentMargin)}%`;
        updateProgressBar();
    } else {
        clearInterval(auctionTimer);
        if (currentPrice <= minPrice) {
            auctionActive = false;
            document.getElementById('winnerMessage').textContent = "No bid, auction ended";
        }
        disableBidButtons();
        document.getElementById('resetButton').style.display = 'block';
    }
}

function placeBid(event) {
    if (auctionActive) {
        auctionActive = false;
        clearInterval(auctionTimer);
        const color = event.target.getAttribute('data-color');
        const winnerMessage = document.getElementById('winnerMessage');
        winnerMessage.textContent = `${color} Bought at ${Math.ceil(currentPrice)} | ${Math.ceil(currentMargin)}%`;

        disableBidButtons();
        document.getElementById('resetButton').style.display = 'block';
    }
}

function disableBidButtons() {
    document.querySelectorAll('.bid-button').forEach(button => {
        button.disabled = true;
        button.style.backgroundColor = 'grey';
        button.style.cursor = 'not-allowed';
    });
}

function updateProgressBar() {
    const progress = (remainingTime / (auctionDuration * 1000)) * 100;
    progressBar.style.width = progress + '%';
}

function resetAuction() {
    const lastAuctionResult = document.getElementById('lastAuctionResult');
    lastAuctionResult.innerHTML = document.getElementById('winnerMessage').textContent;

    document.getElementById('winnerMessage').textContent = '';
    document.getElementById('resetButton').style.display = 'none';

    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('auctionScreen').style.display = 'none';

    document.querySelectorAll('.bid-button').forEach(button => {
        button.disabled = false;
        button.style.cursor = 'pointer';
        const color = button.getAttribute('data-color').toLowerCase();
        button.style.backgroundColor = color;
    });
}
