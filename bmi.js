// Replace with your API Gateway URL after Lambda is deployed
const LAMBDA_URL = "https://your-api-gateway-url/insight";

document.getElementById("bmiform").addEventListener("submit", async function(e) {
    e.preventDefault();
    const wt = parseFloat(document.getElementById("wt").value);
    const ht = parseFloat(document.getElementById("ht").value);
    const bmi = (wt / (ht * ht)).toFixed(2);
    const resultDiv = document.getElementById("result");

    resultDiv.textContent = `Your BMI is ${bmi} — getting insight…`;

    try {
        const response = await fetch(LAMBDA_URL, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ bmi })
        });

        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        resultDiv.innerHTML = `<strong>BMI: ${bmi}</strong><br>${data.content[0].text}`;
    } catch (err) {
        resultDiv.textContent = `BMI: ${bmi} (insight unavailable: ${err.message})`;
    }
});
