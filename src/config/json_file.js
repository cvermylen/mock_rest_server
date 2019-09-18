const fs = require ('fs');

const parseConfig = (file_path) => {
    if (fs.existsSync(file_path)) {
        const content = fs.readFileSync(file_path, 'utf-8');
        const trace = JSON.parse(content.toString());
        if (validate_config() (trace)) return trace;
    } else {
        throw Error ('Config file missing:' + file_path);
    }
};

const validate_config = (trace_config) => {
    if (trace_config.trace) return validate_trace (trace_config.trace);
};

const validate_trace = (trace) => {
    if (!trace.request)
        throw Error ('In config file, trace requires a request element');
    if (!trace.request.output_format)
        throw Error ('In config file, trace.request request an output_format');
    validate_output_format (trace.request.output_format);

    if (!trace.request.connector)
        throw Error ('In config file, trce.request requires connector');
    validate_connector (trace.request.connector);
};

const valid_parameters = [
    'request.header.jsessionid',
    'request.url',
    'server.datetime.now'
];

const validate_output_format = (format) => {
    const parameter_regex = /@{\w(\.\w)*}/g;
    for (let param in format.match(parameter_regex)) {
        const value = param.substr(2, param.length -1);
        if(!valid_parameters.find(p => p === value)) {
            throw Error('In config file, parameter ' + value + 'is not defined');
        }
    }
};
