function camarillaPivotPoints(high, low, close) {
    const pivotPoint = (high + low + close) / 3;

    const r4 = (high - low) * 1.1 / 2 + close;
    const r3 = (high - low) * 1.1 / 4 + close;
    const r2 = (high - low) * 1.1 / 6 + close;
    const r1 = (high - low) * 1.1 / 12 + close;

    const s1 = close - (high - low) * 1.1 / 12;
    const s2 = close - (high - low) * 1.1 / 6;
    const s3 = close - (high - low) * 1.1 / 4;
    const s4 = close - (high - low) * 1.1 / 2;

    const breakoutTarget = close + (high - low) * 1.1;
    const breakdownTarget = close - (high - low) * 1.1;

    return {
        "breakout_target": breakoutTarget,
        "resistance_4": r4,
        "resistance_3": r3,
        "resistance_2": r2,
        "resistance_1": r1,
        "pivot_point": pivotPoint,
        "support_1": s1,
        "support_2": s2,
        "support_3": s3,
        "support_4": s4,
        "breakdown_target": breakdownTarget
    };
}

function getFloatInput(value) {
    const num = parseFloat(value);
    if (isNaN(num)) {
        alert("Invalid input. Please enter a numeric value.");
        throw new Error("Invalid input");
    }
    return num;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calculate-button").addEventListener("click", function() {
        try {
            const high = getFloatInput(document.getElementById("high").value);
            const low = getFloatInput(document.getElementById("low").value);
            const close = getFloatInput(document.getElementById("close").value);

            const pivotPoints = camarillaPivotPoints(high, low, close);
            for (const [key, value] of Object.entries(pivotPoints)) {
                document.getElementById(key).innerText = value.toFixed(2);
            }
        } catch (e) {
            console.error(e);
        }
    });
});
