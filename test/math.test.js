const { celsiusToFahrenheit, fahrenheitToCelsius } =require("../math.js");

test('celsiusToFahrenheit', ()=>{
    const result= celsiusToFahrenheit(0);
    expect(result).toBe(32);
});

test('FahrenheitToCelsius', ()=>{
    const result= fahrenheitToCelsius(32);
    expect(result).toBe(0);
})