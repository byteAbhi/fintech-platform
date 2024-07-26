function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = `
        ${message}
        <span class="close-btn" onclick="closeAlert()">&times;</span>
    `;
    alertBox.className = `alert-box ${type}`;
    alertBox.style.display = 'block';
}

function closeAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'none';
}

async function deposit() {
    const userId = document.getElementById('depositUserId').value;
    const amount = document.getElementById('depositAmount').value;

    if (!userId || !amount) {
        showAlert('User ID and Amount are required', 'error');
        return;
    }

    const response = await fetch('/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: parseInt(userId), amount: parseFloat(amount) })
    });

    const result = await response.json();

    if (response.ok) {
        showAlert('Deposit successful', 'success');
    } else {
        showAlert(result.errors[0].message, 'error');
    }
}

async function withdraw() {
    const userId = document.getElementById('withdrawUserId').value;
    const amount = document.getElementById('withdrawAmount').value;

    if (!userId || !amount) {
        showAlert('User ID and Amount are required', 'error');
        return;
    }

    const response = await fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: parseInt(userId), amount: parseFloat(amount) })
    });

    const result = await response.json();

    if (response.ok) {
        showAlert('Withdrawal successful', 'success');
    } else {
        showAlert(result.errors[0].message, 'error');
    }
}
