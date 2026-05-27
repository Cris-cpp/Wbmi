// Replace with your API Gateway URL after Lambda is deployed

const LAMBDA_URL = "https://japb1e4776.execute-api.eu-north-1.amazonaws.com/default/wbmiforparastore";

document.getElementById("bmiform").addEventListener("submit", async function(e) {
    e.preventDefault();
    const wt = parseFloat(document.getElementById("wt").value);
    const ht = parseFloat(document.getElementById("ht").value)/100;
    
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
       resultDiv.innerHTML = `
    <div class="advice-box">
        <strong>BMI: ${bmi}</strong><br><br>

        ${data.content[0].text
            .replace(/\n/g, "<br>")
            .replace(/\#\# (.*?)(<br>|$)/g, "<h3>$1</h3>")
            .replace(/\# (.*?)(<br>|$)/g, "<h2>$1</h2>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        }
    </div>
`;
    } catch (err) {
        resultDiv.textContent = `BMI: ${bmi} (insight unavailable: ${err.message})`;
    }
});
