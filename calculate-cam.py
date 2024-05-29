def camarilla_pivot_points(high, low, close):
    pivot_point = (high + low + close) / 3

    r4 = (high - low) * 1.1 / 2 + close
    r3 = (high - low) * 1.1 / 4 + close
    r2 = (high - low) * 1.1 / 6 + close
    r1 = (high - low) * 1.1 / 12 + close

    s1 = close - (high - low) * 1.1 / 12
    s2 = close - (high - low) * 1.1 / 6
    s3 = close - (high - low) * 1.1 / 4
    s4 = close - (high - low) * 1.1 / 2

    return {
        "resistance_4": r4,
        "resistance_3": r3,
        "resistance_2": r2,
        "resistance_1": r1,
        "pivot_point": pivot_point,
        "support_1": s1,
        "support_2": s2,
        "support_3": s3,
        "support_4": s4
    }

def get_float_input(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Invalid input. Please enter a numeric value.")

# Example usage
high = get_float_input("Previous day high: ")
low = get_float_input("Previous day low: ")
close = get_float_input("Previous day close: ")

pivot_points = camarilla_pivot_points(high, low, close)
for key, value in pivot_points.items():
    print(f"{key}: {value:.2f}")
