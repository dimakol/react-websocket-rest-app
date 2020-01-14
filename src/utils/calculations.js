/**
 * Calculate the rate by some formula
 * @param {String} bid 
 * @param {String} ask 
 */
export const rateCalculate = async (bid, ask) => {
    try {
        let result = (parseFloat(bid) + parseFloat(ask)) / 2;
        return result.toFixed(2);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Generate rate object with value and color properties.
 * The color of the rate object will be depend by previous rate:
 * If current rate is higher than the previous, then the color should be Green.
 * If current rate is lower than the previous, then the color should be Red.
 * If current rate is the first rate (previous rate is undefined), then the color should be Black.
 * @param {Double} previousRate 
 * @param {Double} currentRate 
 */
export const generateRateObject = async (previousRate, currentRate) => {
    try {
        let RateObj = { value: currentRate };
        if (currentRate > previousRate)
            RateObj.color = "Green";
        if (currentRate < previousRate)
            RateObj.color = "Red";
        if (!previousRate || currentRate === previousRate)
            RateObj.color = "Black";
        return RateObj;
    } catch (err) {
        console.log(err);
    }
}