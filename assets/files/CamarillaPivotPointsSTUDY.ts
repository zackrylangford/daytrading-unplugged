# Camarilla Pivot Points for Thinkorswim
# Calculate previous day's high, low, and close prices
def prevHigh = high(period = "Day")[1];
def prevLow = low(period = "Day")[1];
def prevClose = close(period = "Day")[1];

# Calculate Camarilla Pivot Points
def pivotPoint = (prevHigh + prevLow + prevClose) / 3;

def r4 = (prevHigh - prevLow) * 1.1 / 2 + prevClose;
def r3 = (prevHigh - prevLow) * 1.1 / 4 + prevClose;
def r2 = (prevHigh - prevLow) * 1.1 / 6 + prevClose;
def r1 = (prevHigh - prevLow) * 1.1 / 12 + prevClose;

def s1 = prevClose - (prevHigh - prevLow) * 1.1 / 12;
def s2 = prevClose - (prevHigh - prevLow) * 1.1 / 6;
def s3 = prevClose - (prevHigh - prevLow) * 1.1 / 4;
def s4 = prevClose - (prevHigh - prevLow) * 1.1 / 2;

def breakoutTarget = prevClose + (prevHigh - prevLow) * 1.1;
def breakdownTarget = prevClose - (prevHigh - prevLow) * 1.1;

# Plot Camarilla Pivot Points as horizontal lines with shorter dashed style
plot pivotPointLine = if !IsNaN(pivotPoint) then pivotPoint else Double.NaN;
plot resistance4 = if !IsNaN(r4) then r4 else Double.NaN;
plot resistance3 = if !IsNaN(r3) then r3 else Double.NaN;
plot resistance2 = if !IsNaN(r2) then r2 else Double.NaN;
plot resistance1 = if !IsNaN(r1) then r1 else Double.NaN;
plot support1 = if !IsNaN(s1) then s1 else Double.NaN;
plot support2 = if !IsNaN(s2) then s2 else Double.NaN;
plot support3 = if !IsNaN(s3) then s3 else Double.NaN;
plot support4 = if !IsNaN(s4) then s4 else Double.NaN;
plot breakoutTargetLine = if !IsNaN(breakoutTarget) then breakoutTarget else Double.NaN;
plot breakdownTargetLine = if !IsNaN(breakdownTarget) then breakdownTarget else Double.NaN;

# Set colors for the lines with better contrast
pivotPointLine.SetDefaultColor(Color.BLUE);
resistance4.SetDefaultColor(Color.RED);
resistance3.SetDefaultColor(Color.RED);
resistance2.SetDefaultColor(Color.RED);
resistance1.SetDefaultColor(Color.RED);
support1.SetDefaultColor(Color.GREEN);
support2.SetDefaultColor(Color.GREEN);
support3.SetDefaultColor(Color.GREEN);
support4.SetDefaultColor(Color.GREEN);
breakoutTargetLine.SetDefaultColor(Color.MAGENTA);
breakdownTargetLine.SetDefaultColor(Color.MAGENTA);

# Set style for the lines to shorter dashed
pivotPointLine.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
resistance4.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
resistance3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
resistance2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
resistance1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
support1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
support2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
support3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
support4.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
breakoutTargetLine.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
breakdownTargetLine.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);

# Set shorter dashed line style
pivotPointLine.SetStyle(Curve.SHORT_DASH);
resistance4.SetStyle(Curve.SHORT_DASH);
resistance3.SetStyle(Curve.SHORT_DASH);
resistance2.SetStyle(Curve.SHORT_DASH);
resistance1.SetStyle(Curve.SHORT_DASH);
support1.SetStyle(Curve.SHORT_DASH);
support2.SetStyle(Curve.SHORT_DASH);
support3.SetStyle(Curve.SHORT_DASH);
support4.SetStyle(Curve.SHORT_DASH);
breakoutTargetLine.SetStyle(Curve.SHORT_DASH);
breakdownTargetLine.SetStyle(Curve.SHORT_DASH);

# Set line weights
pivotPointLine.SetLineWeight(1);
resistance4.SetLineWeight(1);
resistance3.SetLineWeight(1);
resistance2.SetLineWeight(1);
resistance1.SetLineWeight(1);
support1.SetLineWeight(1);
support2.SetLineWeight(1);
support3.SetLineWeight(1);
support4.SetLineWeight(1);
breakoutTargetLine.SetLineWeight(1);
breakdownTargetLine.SetLineWeight(1);

# Add bubbles to the lines on the price axis once per day
AddChartBubble(SecondsFromTime(0630) == 0, pivotPoint, "PP", Color.LIGHT_GRAY, yes);
AddChartBubble(SecondsFromTime(0630) == 0, r4, "R4", Color.RED, yes);
AddChartBubble(SecondsFromTime(0630) == 0, r3, "R3", Color.RED, yes);
AddChartBubble(SecondsFromTime(0630) == 0, r2, "R2", Color.RED, yes);
AddChartBubble(SecondsFromTime(0630) == 0, r1, "R1", Color.RED, yes);
AddChartBubble(SecondsFromTime(0630) == 0, s1, "S1", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(0630) == 0, s2, "S2", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(0630) == 0, s3, "S3", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(0630) == 0, s4, "S4", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(0630) == 0, breakoutTarget, "BT", Color.MAGENTA, yes);
AddChartBubble(SecondsFromTime(0630) == 0, breakdownTarget, "BD", Color.MAGENTA, yes);

# Add additional bubbles to the lines in the middle of the day
AddChartBubble(SecondsFromTime(1800) == 0, pivotPoint, "PP", Color.LIGHT_GRAY, yes);
AddChartBubble(SecondsFromTime(1800) == 0, r4, "R4", Color.RED, yes);
AddChartBubble(SecondsFromTime(1800) == 0, r3, "R3", Color.RED, yes);
AddChartBubble(SecondsFromTime(1800) == 0, r2, "R2", Color.RED, yes);
AddChartBubble(SecondsFromTime(1800) == 0, r1, "R1", Color.RED, yes);
AddChartBubble(SecondsFromTime(1800) == 0, s1, "S1", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(1800) == 0, s2, "S2", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(1800) == 0, s3, "S3", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(1800) == 0, s4, "S4", Color.GREEN, yes);
AddChartBubble(SecondsFromTime(1800) == 0, breakoutTarget, "BT", Color.MAGENTA, yes);
AddChartBubble(SecondsFromTime(1800) == 0, breakdownTarget, "BD", Color.MAGENTA, yes);
