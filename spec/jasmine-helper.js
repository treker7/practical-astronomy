function expectToBeWithin(num1, num2, withinDelta) {
    expect(Math.abs(num1 - num2)).toBeLessThan(withinDelta);
}
module.exports = expectToBeWithin;