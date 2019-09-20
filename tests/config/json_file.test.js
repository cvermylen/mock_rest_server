const json_file = require ('../../src/config/json_file');

test ('should not throw an exception if the field exists', () => {
    const o = {aField: 'aValue'};
    let errors = [];
    expect (json_file.validate_field(o.aField, errors,'Error message')).toBeTruthy();
    expect(errors.length).toBe(0);
});

test ('should throw an error if the field is not present', () => {
    const o = {aField: 'aValue'};
    let errors = [];
    expect(json_file.validate_field(o.bField, errors,'Error message')).toBeFalsy();
    expect(errors.length).toBe(1);
});

test ('a valid parameter should be accepted in the format string', () => {
    const valid_param = ['a.Param', 'b.Param'];
    let errors = [];
    const output_format = 'alea @{a.Param} jacta @{b.Param} est';
    expect(json_file.validate_output_format(output_format, valid_param, errors)).toBeTruthy();
    expect(errors.length).toBe(0);
});

test ('an invalid parameter should be reported', () => {
    const valid_param = ['a.param'];
    let errors = [];
    const output_format = '@{param} once upon a @{a.param} time @{b.param}';
    expect (json_file.validate_output_format(output_format, valid_param, errors)).toBeFalsy();
    expect(errors.length).toBe(2);
    expect(errors[0]).toBe('param');
    expect(errors[1]).toBe('b.param');
});
